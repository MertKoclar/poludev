/**
 * Sitemap Oluşturma Scripti
 * Bu script veritabanından dinamik sitemap oluşturur ve public/sitemap.xml dosyasına yazar
 * 
 * Kullanım:
 *   node scripts/generate-sitemap.js
 * 
 * Veya package.json'dan:
 *   npm run generate:sitemap
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// .env dosyasını yükle
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || 'https://poludev.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Hata: SUPABASE_URL ve SUPABASE_ANON_KEY environment değişkenleri gerekli!');
  console.error('Lütfen .env dosyanızı kontrol edin.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const escapeXml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const formatDate = (date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
};

async function generateSitemap() {
  console.log('🚀 Sitemap oluşturuluyor...');
  const urls = [];

  // Statik sayfalar
  const staticPages = [
    {
      loc: `${SITE_URL}/`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: 1.0,
      alternateLocales: [
        { locale: 'en', url: `${SITE_URL}/` },
        { locale: 'tr', url: `${SITE_URL}/tr` },
      ],
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: formatDate(new Date()),
      changefreq: 'monthly',
      priority: 0.8,
      alternateLocales: [
        { locale: 'en', url: `${SITE_URL}/about` },
        { locale: 'tr', url: `${SITE_URL}/tr/about` },
      ],
    },
    {
      loc: `${SITE_URL}/projects`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: 0.9,
      alternateLocales: [
        { locale: 'en', url: `${SITE_URL}/projects` },
        { locale: 'tr', url: `${SITE_URL}/tr/projects` },
      ],
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: 0.9,
      alternateLocales: [
        { locale: 'en', url: `${SITE_URL}/blog` },
        { locale: 'tr', url: `${SITE_URL}/tr/blog` },
      ],
    },
    {
      loc: `${SITE_URL}/cv/mert`,
      lastmod: formatDate(new Date()),
      changefreq: 'monthly',
      priority: 0.7,
      alternateLocales: [
        { locale: 'en', url: `${SITE_URL}/cv/mert` },
        { locale: 'tr', url: `${SITE_URL}/tr/cv/mert` },
      ],
    },
    {
      loc: `${SITE_URL}/cv/mustafa`,
      lastmod: formatDate(new Date()),
      changefreq: 'monthly',
      priority: 0.7,
      alternateLocales: [
        { locale: 'en', url: `${SITE_URL}/cv/mustafa` },
        { locale: 'tr', url: `${SITE_URL}/tr/cv/mustafa` },
      ],
    },
  ];

  urls.push(...staticPages);
  console.log(`✅ ${staticPages.length} statik sayfa eklendi`);

  // Dinamik proje sayfaları
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, updated_at, created_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    if (projects && projects.length > 0) {
      projects.forEach((project) => {
        const lastmod = formatDate(project.updated_at || project.created_at);
        urls.push({
          loc: `${SITE_URL}/projects/${project.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: 0.7,
          alternateLocales: [
            { locale: 'en', url: `${SITE_URL}/projects/${project.id}` },
            { locale: 'tr', url: `${SITE_URL}/tr/projects/${project.id}` },
          ],
        });
      });
      console.log(`✅ ${projects.length} proje sayfası eklendi`);
    } else {
      console.log('⚠️  Aktif proje bulunamadı');
    }
  } catch (error) {
    console.error('❌ Projeler alınırken hata:', error.message);
  }

  // Dinamik blog yazıları
  try {
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('slug_tr, slug_en, updated_at, created_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach((post) => {
        const lastmod = formatDate(post.updated_at || post.published_at || post.created_at);
        
        // Türkçe versiyon
        if (post.slug_tr) {
          urls.push({
            loc: `${SITE_URL}/blog/${post.slug_tr}`,
            lastmod,
            changefreq: 'monthly',
            priority: 0.7,
            alternateLocales: [
              { locale: 'tr', url: `${SITE_URL}/blog/${post.slug_tr}` },
              { locale: 'en', url: `${SITE_URL}/blog/${post.slug_en || post.slug_tr}` },
            ],
          });
        }

        // İngilizce versiyon
        if (post.slug_en && post.slug_en !== post.slug_tr) {
          urls.push({
            loc: `${SITE_URL}/blog/${post.slug_en}`,
            lastmod,
            changefreq: 'monthly',
            priority: 0.7,
            alternateLocales: [
              { locale: 'en', url: `${SITE_URL}/blog/${post.slug_en}` },
              { locale: 'tr', url: `${SITE_URL}/blog/${post.slug_tr || post.slug_en}` },
            ],
          });
        }
      });
      console.log(`✅ ${blogPosts.length} blog yazısı eklendi`);
    } else {
      console.log('⚠️  Yayınlanmış blog yazısı bulunamadı');
    }
  } catch (error) {
    console.error('❌ Blog yazıları alınırken hata:', error.message);
  }

  // XML oluştur
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Ana Sayfa - Homepage -->
`;

  urls.forEach((url) => {
    xml += `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
`;

    if (url.alternateLocales) {
      url.alternateLocales.forEach((alt) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${escapeXml(alt.url)}" />
`;
      });
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url.loc)}" />
`;
    }

    xml += `  </url>
`;
  });

  xml += `</urlset>
`;

  // Dosyaya yaz
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(`\n✅ Sitemap başarıyla oluşturuldu!`);
  console.log(`📁 Konum: ${outputPath}`);
  console.log(`📊 Toplam URL sayısı: ${urls.length}`);
  console.log(`\n🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`);
};

// Script'i çalıştır
generateSitemap().catch((error) => {
  console.error('❌ Sitemap oluşturulurken hata:', error);
  process.exit(1);
});

