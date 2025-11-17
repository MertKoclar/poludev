import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Instagram, Code2 } from 'lucide-react';
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
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
              {t('home.title')}
            </h3>
            <p className="text-gray-400 mb-4">
              {t('home.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => {
                  const Icon = iconMap[social.icon_name || social.platform.toLowerCase()] || Code2;
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      aria-label={social.platform}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })
              ) : (
                // Fallback to default icons if no data
                <>
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {loading ? (
                <li className="text-gray-400">{t('common.loading')}</li>
              ) : footerLinks.length > 0 ? (
                footerLinks.map((link) => {
                  const label = lang === 'tr' ? link.label_tr : link.label_en;
                  if (link.is_external) {
                    return (
                      <li key={link.id}>
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors inline-block"
                        >
                          {label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={link.id}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors inline-block"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-400">{t('common.home')}</li>
              )}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.contact')}</h4>
            <p className="text-gray-400 mb-2">
              {t('footer.email')}: poludevs@gmail.com
            </p>
            <p className="text-gray-400">
              {t('footer.buildTogether')}
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              &copy; {currentYear} {t('home.title')}. {t('footer.allRightsReserved')}
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Poludev {t('footer.by')}  <Code2 className="w-4 h-4 text-orange-500" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
