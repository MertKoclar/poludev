import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Globe, Instagram, Facebook, Youtube } from 'lucide-react';
import type { SocialLink as SocialLinkType } from '../types';

interface SocialLinksProps {
  links: SocialLinkType[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
  mail: Mail,
  website: Globe,
  globe: Globe,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ 
  links, 
  size = 'md',
  variant = 'default' 
}) => {
  if (!links || links.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link, index) => {
        const platform = link.platform.toLowerCase();
        const Icon = iconMap[platform] || Globe;

        return (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            className={`
              ${sizeClasses[size]}
              ${variant === 'minimal' 
                ? 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }
              rounded-lg transition-colors
            `}
            aria-label={link.platform}
          >
            <Icon className={iconSizes[size]} />
          </motion.a>
        );
      })}
    </div>
  );
};

