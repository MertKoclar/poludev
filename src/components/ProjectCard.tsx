import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  delay: number;
}

const ProjectCard = memo(({ title, description, technologies, delay }: ProjectCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-all duration-500 border border-gray-200 dark:border-gray-700"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      viewport={{ once: true }}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech: string, index: number) => (
            <span key={index} className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" role="listitem">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export { ProjectCard };