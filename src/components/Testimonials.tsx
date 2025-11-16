import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, User } from 'lucide-react';
import type { Testimonial as TestimonialType } from '../types';
import { useTranslation } from 'react-i18next';

interface TestimonialsProps {
  testimonials: TestimonialType[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'tr' | 'en';

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('about.testimonials.title') || 'What People Say'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('about.testimonials.subtitle') || 'Testimonials from our clients and partners'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id || `testimonial-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-orange-200 dark:text-orange-900/30">
                <Quote className="w-8 h-8" />
              </div>

              {renderStars(testimonial.rating)}

              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "{lang === 'tr' ? testimonial.content_tr : testimonial.content_en}"
              </p>

              <div className="flex items-center gap-4">
                {testimonial.avatar_url ? (
                  <img
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                    {testimonial.company && ` ${t('common.at')} ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

