import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { CodeXml, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Re-create navLinks when language changes
  const navLinks = useMemo(() => [
    { path: '/', label: t('common.home') },
    { path: '/about', label: t('common.about') },
    { path: '/projects', label: t('common.projects') },
    { path: '/blog', label: t('common.blog') || 'Blog' },
  ], [t, i18n.language]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="flex text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600"
            >
              {/* {t('home.title')} */}
              <span className='dark:text-white text-gray-800 inline-flex items-center gap-2'><CodeXml />Polu</span><span className='text-orange-500'>dev</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300 dark:border-gray-700">
              {isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  <Link
                    to="/admin"
                    className={`flex items-center justify-center p-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md ${
                      isActive('/admin') || location.pathname.startsWith('/admin')
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    aria-label={t('common.admin') || 'Admin'}
                    title={t('common.admin') || 'Admin'}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                </motion.div>
              )}
              {user && (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                  aria-label={t('common.logout') || 'Logout'}
                  title={t('common.logout') || 'Logout'}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              )}
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-col gap-4 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between px-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center"
                      >
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-center p-2.5 rounded-lg transition-colors duration-200 shadow-sm ${
                            isActive('/admin') || location.pathname.startsWith('/admin')
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                          aria-label={t('common.admin') || 'Admin'}
                          title={t('common.admin') || 'Admin'}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                        </Link>
                      </motion.div>
                    )}
                    {user && (
                      <motion.button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-sm"
                        aria-label={t('common.logout') || 'Logout'}
                        title={t('common.logout') || 'Logout'}
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.button>
                    )}
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
