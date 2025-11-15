import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Code2, 
  FileCode, 
  Server, 
  Database, 
  Palette,
  Sparkles,
  Cloud,
  Box,
  Layers,
  Network,
  Zap
} from 'lucide-react';

export const TechnologiesSection: React.FC = () => {
  const { t } = useTranslation();

  const technologies = [
    { icon: Code2, name: 'React', color: 'text-blue-500', bgColor: 'from-blue-500 to-blue-600' },
    { icon: FileCode, name: 'TypeScript', color: 'text-blue-600', bgColor: 'from-blue-600 to-blue-700' },
    { icon: Server, name: 'Node.js', color: 'text-green-600', bgColor: 'from-green-500 to-green-600' },
    { icon: Database, name: 'PostgreSQL', color: 'text-blue-700', bgColor: 'from-blue-600 to-blue-800' },
    { icon: Palette, name: 'Tailwind CSS', color: 'text-cyan-500', bgColor: 'from-cyan-500 to-cyan-600' },
    { icon: Sparkles, name: 'Framer Motion', color: 'text-purple-600', bgColor: 'from-purple-500 to-purple-600' },
    { icon: Cloud, name: 'Supabase', color: 'text-green-500', bgColor: 'from-green-400 to-green-600' },
    { icon: Box, name: 'Docker', color: 'text-blue-400', bgColor: 'from-blue-400 to-blue-500' },
    { icon: Layers, name: 'Kubernetes', color: 'text-blue-600', bgColor: 'from-blue-500 to-indigo-600' },
    { icon: Network, name: 'GraphQL', color: 'text-pink-600', bgColor: 'from-pink-500 to-pink-600' },
    { icon: Database, name: 'MongoDB', color: 'text-green-500', bgColor: 'from-green-400 to-green-600' },
    { icon: Zap, name: 'Python', color: 'text-yellow-500', bgColor: 'from-yellow-400 to-yellow-600' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('technologies.title') || 'Technologies We Love'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('technologies.subtitle') || 'Modern tools and frameworks we work with'}
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.15, y: -10 }}
                className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-4 rounded-xl bg-gradient-to-br ${tech.bgColor} mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

