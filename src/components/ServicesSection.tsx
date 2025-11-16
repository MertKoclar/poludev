import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code, Smartphone, Globe, Database, Palette, Rocket } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Code,
      titleKey: 'services.web.title',
      descriptionKey: 'services.web.description',
      color: 'from-orange-500 to-orange-600',
      delay: 0.1,
    },
    {
      icon: Smartphone,
      titleKey: 'services.mobile.title',
      descriptionKey: 'services.mobile.description',
      color: 'from-orange-600 to-amber-600',
      delay: 0.2,
    },
    {
      icon: Globe,
      titleKey: 'services.api.title',
      descriptionKey: 'services.api.description',
      color: 'from-amber-500 to-amber-600',
      delay: 0.3,
    },
    {
      icon: Database,
      titleKey: 'services.backend.title',
      descriptionKey: 'services.backend.description',
      color: 'from-orange-500 to-orange-600',
      delay: 0.4,
    },
    {
      icon: Palette,
      titleKey: 'services.uiux.title',
      descriptionKey: 'services.uiux.description',
      color: 'from-green-500 to-green-600',
      delay: 0.5,
    },
    {
      icon: Rocket,
      titleKey: 'services.deployment.title',
      descriptionKey: 'services.deployment.description',
      color: 'from-cyan-500 to-cyan-600',
      delay: 0.6,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('services.title') || 'Our Services'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('services.subtitle') || 'Comprehensive solutions for your digital needs'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: service.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {t(service.titleKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t(service.descriptionKey)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

