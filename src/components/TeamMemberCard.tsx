import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface SocialLink {
  icon: string;
  url: string;
}

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
}

const TeamMemberCard = memo(({ name, role, bio, image, socialLinks }: TeamMemberCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-all duration-500 border border-gray-200 dark:border-gray-700"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl w-full h-full" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
        <p className="text-orange-600 dark:text-orange-400 font-medium mb-3">{role}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{bio}</p>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <a 
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300"
              aria-label={`Profilini ziyaret et`}
            >
              <span className="w-5 h-5" aria-hidden="true">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

export { TeamMemberCard };