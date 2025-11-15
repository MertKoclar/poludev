import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface SkillsSectionProps {
  skills: string[];
  color?: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, color = 'blue' }) => {
  const { t } = useTranslation();
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'purple':
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'pink':
        return 'bg-gradient-to-r from-pink-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('skills.title')}
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.1, y: -2 }}
            className={`px-4 py-2 ${getColorClass(color)} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow cursor-default`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

