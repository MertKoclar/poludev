import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Instagram, Code2, Heart } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import type { FooterLink, SocialLinkItem } from '../types';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'tr' | 'en';
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  // Icon mapping
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    mail: Mail,
  };

  useEffect(() => {
    fetchFooterLinks();
    fetchSocialLinks();
  }, []);

  const fetchFooterLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFooterLinks(data || []);
    } catch (error) {
      console.error('Error fetching footer links:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  return (
    <footer className="relative bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Main Content - Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          {/* Brand Section - Takes more space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5"
          >
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-500">
                {t('home.title')}
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed max-w-sm">
              {t('home.description')}
            </p>
            
            {/* Social Links - Horizontal with labels */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((social, index) => {
                  const Icon = iconMap[social.icon_name || social.platform.toLowerCase()] || Code2;
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, x: 2 }}
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                      aria-label={social.platform}
                    >
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {social.platform}
                      </span>
                    </motion.a>
                  );
                })
              ) : (
                <>
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: 2 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">GitHub</span>
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: 2 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn</span>
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>

          {/* Quick Links - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-3"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {loading ? (
                <li className="text-gray-500 dark:text-gray-400 text-sm">{t('common.loading')}</li>
              ) : footerLinks.length > 0 ? (
                footerLinks.map((link, index) => {
                  const label = lang === 'tr' ? link.label_tr : link.label_en;
                  if (link.is_external) {
                    return (
                      <motion.li
                        key={link.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                          <span>{label}</span>
                        </a>
                      </motion.li>
                    );
                  }
                  return (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        to={link.path}
                        className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 group-hover:bg-orange-500 transition-colors"></span>
                        <span>{label}</span>
                      </Link>
                    </motion.li>
                  );
                })
              ) : (
                <li className="text-gray-500 dark:text-gray-400 text-sm">{t('common.home')}</li>
              )}
            </ul>
          </motion.div>

          {/* Contact Info - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <div className="space-y-3">
              <motion.a
                href="mailto:poludevs@gmail.com"
                whileHover={{ x: 3 }}
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span>poludevs@gmail.com</span>
              </motion.a>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
                {t('footer.buildTogether')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar - Minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              &copy; {currentYear} {t('home.title')}. {t('footer.allRightsReserved')}
            </p>
            <motion.p
              className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
            >
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by{' '}
              <span className="text-orange-600 dark:text-orange-400 font-medium">Poludev</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
