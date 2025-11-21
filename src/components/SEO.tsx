import React from 'react';
import { Helmet } from 'react-helmet-async';
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
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://poludev.com';
  const currentUrl = url || `${siteUrl}${location.pathname}${location.search}`;
  const currentTitle = title 
    ? `${title} | ${siteName}` 
    : `${siteName} - Web & Mobil Geliştiriciler | Mert & Mustafa`;
  
  const currentDescription = description || 'Modern web çözümleri üreten full-stack geliştiriciler. React, TypeScript, Node.js, Supabase. Profesyonel web geliştirme hizmetleri.';
  const currentImage = image || `${siteUrl}/og-image.jpg`;
  const canonicalUrl = canonical || currentUrl;
  
  // Default locale mapping for Open Graph
  const ogLocale = currentLocale === 'tr' ? 'tr_TR' : currentLocale === 'en' ? 'en_US' : 'tr_TR';

  // Generate image dimensions for better SEO
  const imageWidth = 1200;
  const imageHeight = 630;

  // Robots meta tag
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{currentTitle}</title>
      <meta name="title" content={currentTitle} />
      <meta name="description" content={currentDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="language" content={currentLocale === 'tr' ? 'Türkçe, İngilizce' : 'English, Turkish'} />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#f97316" />
      
      {/* Search Engine Bots */}
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />

      {/* Geo Tags */}
      <meta name="geo.region" content="TR-16" />
      <meta name="geo.placename" content="Bursa, Türkiye" />

      {/* Additional SEO Tags */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="coverage" content="worldwide" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={currentImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={currentTitle} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Alternate Locales for Open Graph */}
      {currentLocale === 'tr' ? (
        <meta property="og:locale:alternate" content="en_US" />
      ) : (
        <meta property="og:locale:alternate" content="tr_TR" />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={currentImage} />
      <meta name="twitter:image:alt" content={currentTitle} />

      {/* Article Meta Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Language Links */}
      {alternateLocales && alternateLocales.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}
      {alternateLocales && (
        <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      )}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

