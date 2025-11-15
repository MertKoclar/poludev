import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Lightbulb, Code2, Rocket, CheckCircle } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Search,
      titleKey: 'process.discover.title',
      descriptionKey: 'process.discover.description',
      number: '01',
    },
    {
      icon: Lightbulb,
      titleKey: 'process.design.title',
      descriptionKey: 'process.design.description',
      number: '02',
    },
    {
      icon: Code2,
      titleKey: 'process.develop.title',
      descriptionKey: 'process.develop.description',
      number: '03',
    },
    {
      icon: Rocket,
      titleKey: 'process.deploy.title',
      descriptionKey: 'process.deploy.description',
      number: '04',
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
            {t('process.title') || 'Our Process'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('process.subtitle') || 'How we bring your ideas to life'}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line (not for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-0 transform translate-x-4">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
                      />
                    </div>
                  )}

                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

