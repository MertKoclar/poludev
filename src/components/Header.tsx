import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { NavLink } from './NavLink';
import { smoothScrollTo } from '../utils/smoothScroll';

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { name: 'Hizmetler', to: '#hizmetler' },
    { name: 'Teknolojiler', to: '#teknolojiler' },
    { name: 'İletişim', to: '#iletisim' },
  ];

  // useCallback ile setMenuOpen fonksiyonunu optimize et
  const setIsMenuOpenCallback = useCallback((open: boolean) => {
    setIsMenuOpen(open);
  }, []);

  // useCallback ile toggleMenu fonksiyonunu optimize et
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo("hero");
            }}
            className="text-3xl font-extrabold text-orange-600 tracking-wider cursor-pointer"
            whileHover={{ scale: 1.05 }}
            aria-label="Ana Sayfa"
          >
            Poludev<span className="text-gray-900 dark:text-white">.</span>
          </motion.a>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden lg:flex items-center space-x-6" role="navigation" aria-label="Ana Menü">
            {links.map((link) => (
              <NavLink key={link.name} to={link.to} setMenuOpen={setIsMenuOpenCallback}>{link.name}</NavLink>
            ))}
            <ThemeToggleButton />
          </nav>

          {/* Mobil Menü Butonu */}
          <div className="flex lg:hidden items-center space-x-3">
            <ThemeToggleButton />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-orange-600 hover:bg-orange-100 dark:hover:bg-gray-800 transition duration-300"
              aria-label="Menü Aç/Kapat"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              role="button"
              tabIndex={0}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden shadow-xl bg-white dark:bg-gray-800 border-t border-orange-500/20"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobil Menü"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
              {links.map((link) => (
                <NavLink key={link.name} to={link.to} setMenuOpen={setIsMenuOpenCallback}>
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

export default Header;