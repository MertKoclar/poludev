import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from './TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ayşe Korkmaz",
      role: "CTO",
      company: "TechSolutions",
      content: "Poludev ekibi, projemizi zamanında ve bütçe dahilinde harika bir şekilde tamamladı. E-ticaret platformumuz çok başarılı oldu.",
      rating: 5
    },
    {
      name: "Mehmet Şahin",
      role: "Yönetici",
      company: "Global Finans",
      content: "Mobil bankacılık uygulaması için sağladıkları hizmetten çok memnun kaldık. Kullanıcı dostu ve güvenli bir çözüm sundular.",
      rating: 5
    },
    {
      name: "Fatma Yıldız",
      role: "Pazarlama Müdürü",
      company: "E-Ticaret A.Ş.",
      content: "Kurumsal yönetim sistemi sayesinde operasyonlarımızda %40'lık bir verimlilik artışı sağladık. Teşekkürler Poludev!",
      rating: 4
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" id="referanslar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Müşteri Referansları
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Müşterilerimizin bizim hakkımızda ne düşündüklerini öğrenin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;