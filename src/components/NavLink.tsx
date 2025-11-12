import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { smoothScrollTo } from '../utils/smoothScroll';

const NavLink = memo(({ to, children, setMenuOpen }: { to: string; children: React.ReactNode; setMenuOpen: (open: boolean) => void }) => (
  <motion.a
    href={to}
    onClick={(e) => {
      e.preventDefault();
      setMenuOpen(false);
      const targetId = to.substring(1); // Remove the # from the href
      smoothScrollTo(targetId);
    }}
    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition duration-300 px-3 py-2 text-sm lg:text-base cursor-pointer"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {children}
  </motion.a>
));

export { NavLink };