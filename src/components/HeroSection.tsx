import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-48 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" id="hero">
      {/* Gelişmiş Arka Plan Efekti: Turuncu Degrade ve Desen */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 transition-opacity duration-500">
        <div className="w-full h-full bg-gradient-to-br from-orange-600/10 to-transparent absolute inset-0 mix-blend-multiply dark:mix-blend-lighten"></div>
        <div className="absolute inset-0 bg-[url('https://api.iconify.design/lucide/grip.svg?color=%23f97316&width=16&height=16')] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" style={{ backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Dijital Geleceğiniz <span className="text-orange-600 dark:text-orange-400">Bizimle Başlar.</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Poludev, inovatif Full Stack ve Mobil çözümlerle işletmenizi dijital çağın zirvesine taşır. Hayalinizdeki yazılımı gerçeğe dönüştürmek için buradayız.
          </motion.p>
          
          <motion.a
            href="#iletisim"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("iletisim");
            }}
            className="inline-flex items-center justify-center px-8 py-4 border-4 border-orange-600 text-base font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-orange-500/50 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(249, 115, 22, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Projenizi Başlatalım <ArrowRight className="ml-3 w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;