/**
 * Generate dynamic sitemap for projects
 * This can be used to generate sitemap.xml dynamically from the database
 */

import { supabase } from '../config/supabaseClient';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternateLocales?: { locale: string; url: string }[];
}

const SITE_URL = 'https://poludev.com';

export const generateSitemap = async (): Promise<string> => {
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${SITE_URL}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0,
    alternateLocales: [
      { locale: 'en', url: `${SITE_URL}/` },
      { locale: 'tr', url: `${SITE_URL}/tr` },
    ],
  });

  urls.push({
    loc: `${SITE_URL}/about`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8,
    alternateLocales: [
      { locale: 'en', url: `${SITE_URL}/about` },
      { locale: 'tr', url: `${SITE_URL}/tr/about` },
    ],
  });

  urls.push({
    loc: `${SITE_URL}/projects`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9,
    alternateLocales: [
      { locale: 'en', url: `${SITE_URL}/projects` },
      { locale: 'tr', url: `${SITE_URL}/tr/projects` },
    ],
  });

  urls.push({
    loc: `${SITE_URL}/blog`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9,
    alternateLocales: [
      { locale: 'en', url: `${SITE_URL}/blog` },
      { locale: 'tr', url: `${SITE_URL}/tr/blog` },
    ],
  });

  // Dynamic project pages
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, updated_at, created_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });

    if (!error && projects) {
      projects.forEach((project: { id: string; updated_at?: string; created_at?: string }) => {
        const lastmod = project.updated_at
          ? new Date(project.updated_at).toISOString().split('T')[0]
          : project.created_at
          ? new Date(project.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

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
    console.error('Error fetching projects for sitemap:', error);
  }

  // Dynamic blog post pages
  try {
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('slug_tr, slug_en, updated_at, created_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && blogPosts) {
      blogPosts.forEach((post: { slug_tr: string; slug_en: string; updated_at?: string; created_at?: string; published_at?: string }) => {
        const lastmod = post.updated_at
          ? new Date(post.updated_at).toISOString().split('T')[0]
          : post.published_at
          ? new Date(post.published_at).toISOString().split('T')[0]
          : post.created_at
          ? new Date(post.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        // Turkish version
        urls.push({
          loc: `${SITE_URL}/blog/${post.slug_tr}`,
          lastmod,
          changefreq: 'monthly',
          priority: 0.7,
          alternateLocales: [
            { locale: 'tr', url: `${SITE_URL}/blog/${post.slug_tr}` },
            { locale: 'en', url: `${SITE_URL}/blog/${post.slug_en}` },
          ],
        });

        // English version
        urls.push({
          loc: `${SITE_URL}/blog/${post.slug_en}`,
          lastmod,
          changefreq: 'monthly',
          priority: 0.7,
          alternateLocales: [
            { locale: 'en', url: `${SITE_URL}/blog/${post.slug_en}` },
            { locale: 'tr', url: `${SITE_URL}/blog/${post.slug_tr}` },
          ],
        });
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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

  xml += `</urlset>`;

  return xml;
};

const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

