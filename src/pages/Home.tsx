import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { StatisticsSection } from '../components/StatisticsSection';
import { ServicesSection } from '../components/ServicesSection';
import { TechnologiesSection } from '../components/TechnologiesSection';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { ProcessSection } from '../components/ProcessSection';
import { CTASection } from '../components/CTASection';

export const Home: React.FC = () => {
  return (
    <>
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
