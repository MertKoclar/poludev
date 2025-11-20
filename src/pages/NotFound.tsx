import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={t('notFoundPage.title')} 
        description={t('notFoundPage.description')}
        noindex={true}
      />
      <div className="min-h-[70vh] flex items-center justify-center mt-16 px-4 py-16">
        <div className="text-center max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="w-32 h-32 text-orange-600 dark:text-orange-500 relative z-10" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
          >
            {t('notFoundPage.title')}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 text-lg"
          >
            {t('notFoundPage.description')}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-orange-600/20"
            >
              <Home className="w-5 h-5" />
              {t('notFoundPage.button')}
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};
