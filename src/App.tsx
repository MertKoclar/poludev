import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PortfolioSection from './components/PortfolioSection';
import TestimonialsSection from './components/TestimonialsSection';
import ServicesSection from './components/ServicesSection';
import TechStackSection from './components/TechStackSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// ====================================================================
// ANA BİLEŞEN (App.jsx)
// Tüm Context ve Bileşenleri bir araya getirir.
// ====================================================================

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <Header />
        <main>
          <div id="hero">
            <HeroSection />
          </div>
          <div id="hakkimizda">
            <AboutSection />
          </div>
          <div id="projeler">
            <PortfolioSection />
          </div>
          <div id="referanslar">
            <TestimonialsSection />
          </div>
          <div id="hizmetler">
            <ServicesSection />
          </div>
          <div id="teknolojiler">
            <TechStackSection />
          </div>
          <div id="iletisim">
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;