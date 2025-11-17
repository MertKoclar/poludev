/**
 * Vercel Serverless Function - Dinamik Sitemap API
 * Bu endpoint veritabanından dinamik sitemap oluşturur
 * 
 * Kullanım: https://poludev.com/api/sitemap
 */

import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.VITE_SITE_URL || 'https://poludev.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

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

export default async function handler(req, res) {
  // Sadece GET isteklerine izin ver
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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

    // Dinamik proje sayfaları
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('id, updated_at, created_at')
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (!error && projects) {
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
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }

    // Dinamik blog yazıları
    try {
      const { data: blogPosts, error } = await supabase
        .from('blog_posts')
        .select('slug_tr, slug_en, updated_at, created_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (!error && blogPosts) {
        blogPosts.forEach((post) => {
          const lastmod = formatDate(post.updated_at || post.published_at || post.created_at);
          
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
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
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

    // XML'i döndür
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

