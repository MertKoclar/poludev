import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: { locale: string; url: string }[];
  structuredData?: object;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Poludev - Mert & Mustafa',
  publishedTime,
  modifiedTime,
  siteName = 'Poludev',
  locale,
  alternateLocales,
  structuredData,
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const currentLocale = locale || i18n.language || 'tr';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = url || `${siteUrl}${location.pathname}${location.search}`;
  const currentTitle = title 
    ? `${title} | ${siteName}` 
    : siteName;
  const currentDescription = description || 'Modern web çözümleri üreten full-stack geliştiriciler. React, TypeScript, Node.js, Supabase. Profesyonel web geliştirme hizmetleri.';
  const currentImage = image || `${siteUrl}/og-image.jpg`;
  const canonicalUrl = canonical || currentUrl;
  
  // Default locale mapping for Open Graph
  const ogLocale = currentLocale === 'tr' ? 'tr_TR' : currentLocale === 'en' ? 'en_US' : 'tr_TR';

  // Generate image dimensions for better SEO
  const imageWidth = 1200;
  const imageHeight = 630;

  useEffect(() => {
    // Update document title
    document.title = currentTitle;

    // Meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', currentDescription);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }
    updateMetaTag('author', author);
    updateMetaTag('language', currentLocale === 'tr' ? 'Türkçe, İngilizce' : 'English, Turkish');
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('theme-color', '#f97316');
    
    // Search engine bots
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('bingbot', 'index, follow');
    
    // Geo tags
    updateMetaTag('geo.region', 'TR-16');
    updateMetaTag('geo.placename', 'Bursa, Türkiye');
    
    // Additional SEO tags
    updateMetaTag('rating', 'general');
    updateMetaTag('distribution', 'global');
    updateMetaTag('coverage', 'worldwide');
    updateMetaTag('target', 'all');
    updateMetaTag('audience', 'all');

    // Open Graph tags
    updateMetaTag('og:title', currentTitle, true);
    updateMetaTag('og:description', currentDescription, true);
    updateMetaTag('og:image', currentImage, true);
    updateMetaTag('og:image:width', String(imageWidth), true);
    updateMetaTag('og:image:height', String(imageHeight), true);
    updateMetaTag('og:image:alt', currentTitle, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', ogLocale, true);
    
    // Add alternate locale for Open Graph
    if (currentLocale === 'tr') {
      updateMetaTag('og:locale:alternate', 'en_US', true);
    } else {
      updateMetaTag('og:locale:alternate', 'tr_TR', true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', currentTitle);
    updateMetaTag('twitter:description', currentDescription);
    updateMetaTag('twitter:image', currentImage);
    updateMetaTag('twitter:image:alt', currentTitle);

    // Article meta tags
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Robots meta tag
    const robotsContent = [
      noindex ? 'noindex' : 'index',
      nofollow ? 'nofollow' : 'follow',
    ].join(', ');
    updateMetaTag('robots', robotsContent);
    
    // Update googlebot and bingbot if robots are set
    if (noindex || nofollow) {
      updateMetaTag('googlebot', robotsContent);
      updateMetaTag('bingbot', robotsContent);
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Alternate language links
    if (alternateLocales && alternateLocales.length > 0) {
      // Remove existing alternate links
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());

      // Add alternate links
      alternateLocales.forEach(({ locale, url }) => {
        const alternateLink = document.createElement('link');
        alternateLink.rel = 'alternate';
        alternateLink.hreflang = locale;
        alternateLink.href = url;
        document.head.appendChild(alternateLink);
      });

      // Add x-default
      const defaultLink = document.createElement('link');
      defaultLink.rel = 'alternate';
      defaultLink.hreflang = 'x-default';
      defaultLink.href = currentUrl;
      document.head.appendChild(defaultLink);
    }

    // Structured data (JSON-LD)
    if (structuredData) {
      // Remove existing structured data
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          if (data['@context'] === 'https://schema.org') {
            script.remove();
          }
        } catch {
          script.remove();
        }
      });

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [
    currentTitle,
    currentDescription,
    keywords,
    currentImage,
    currentUrl,
    type,
    author,
    publishedTime,
    modifiedTime,
    siteName,
    currentLocale,
    ogLocale,
    alternateLocales,
    structuredData,
    noindex,
    nofollow,
    canonicalUrl,
  ]);

  return null;
};

