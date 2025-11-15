import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { StatisticsSection } from '../components/StatisticsSection';
import { ServicesSection } from '../components/ServicesSection';
import { TechnologiesSection } from '../components/TechnologiesSection';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { ProcessSection } from '../components/ProcessSection';
import { CTASection } from '../components/CTASection';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentLocale = i18n.language || 'en';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Poludev',
    alternateName: 'Poludev - Mert & Mustafa',
    url: `${siteUrl}${location.pathname}`,
    logo: `${siteUrl}/logo.png`,
    description: t('home.description') || 'Full-stack developers creating modern web solutions',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'Mert',
        jobTitle: 'Full-stack Developer',
      },
      {
        '@type': 'Person',
        name: 'Mustafa',
        jobTitle: 'Full-stack Developer',
      },
    ],
    sameAs: [
      // Add your social media profiles here
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Turkish'],
    },
  };

  const alternateLocales = [
    { locale: 'en', url: `${siteUrl}/` },
    { locale: 'tr', url: `${siteUrl}/tr/` },
  ];

  return (
    <>
      <SEO
        title={t('home.title') || 'Poludev'}
        description={t('home.description') || 'Full-stack developers creating modern web solutions'}
        keywords="full-stack developer, web development, React, TypeScript, Node.js, Supabase, software development, web design, Mert, Mustafa, Poludev"
        url={`${siteUrl}${location.pathname}`}
        type="website"
        locale={currentLocale}
        alternateLocales={alternateLocales}
        structuredData={structuredData}
      />
      <HeroSection />
      <StatisticsSection />
      <ServicesSection />
      <TechnologiesSection />
      <FeaturedProjects />
      <ProcessSection />
      <CTASection />
    </>
  );
};
