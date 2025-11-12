import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  delay: number;
}

const ServiceCard = memo(({ icon, title, description, features, delay }: ServiceCardProps) => {
    const Icon = icon;

    return (
        <motion.div
            id="hizmetler"
            className="group relative p-8 md:p-10 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 transition-all duration-500 border border-transparent dark:border-gray-700/50"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, delay: delay, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.3 }}
            
            // 3D Kalkma ve Parlama Efekti
            whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.4)", // Güçlü gölge
                y: -10 
            }}
            style={{ 
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            }}
        >
            {/* Parlama Efekti için Turuncu Kavis */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
                <div className="p-3 bg-orange-100/70 dark:bg-orange-900/50 rounded-xl inline-flex mb-6 transition-colors duration-500">
                    <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
                
                <ul className="space-y-3">
                    {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-800 dark:text-gray-200 font-medium" role="listitem">
                            <Check className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" aria-hidden="true" />
                            {feature}
                        </li>
                    ))}
                </ul>

                <a 
                  href="#iletisim" 
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo("iletisim");
                  }}
                  className="mt-8 inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-300 cursor-pointer"
                >
                    Daha Fazla Bilgi <ArrowRight className="w-4 h-4 ml-2" />
                </a>
            </div>
        </motion.div>
    );
});

export { ServiceCard };