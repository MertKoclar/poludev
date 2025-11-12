import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const TestimonialCard = memo(({ name, role, company, content, rating }: TestimonialCardProps) => {
  return (
    <motion.div
      className="p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-4">
        {/* Yıldızlar */}
        <div className="flex text-orange-500">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < rating ? 'fill-current' : 'fill-none'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          ))}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{content}"</p>
      
      <div className="flex items-center">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
        <div className="ml-4">
          <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
});

export { TestimonialCard };