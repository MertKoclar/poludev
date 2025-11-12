import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: Linkedin, href: '#' },
        { icon: Github, href: '#' },
        { icon: Twitter, href: '#' },
        { icon: Facebook, href: '#' },
    ];

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <motion.p
                            className="text-lg font-bold text-orange-400"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Poludev <span className="text-gray-400">Yazılım Hizmetleri</span>
                        </motion.p>
                    </div>
                    
                    <div className="flex space-x-6">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-orange-600 transition duration-300"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                viewport={{ once: true }}
                                aria-label={link.icon.name}
                            >
                                <link.icon className="w-6 h-6" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Poludev Yazılım Hizmetleri. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;