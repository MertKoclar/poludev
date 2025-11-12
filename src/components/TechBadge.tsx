import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface TechBadgeProps {
  icon: React.ElementType;
  name: string;
  color: string;
  delay: number;
}

const TechBadge = memo(({ icon, name, color, delay }: TechBadgeProps) => {
    const Icon = icon;
    
    // Rastgele hafif bir yalpalanma animasyonu
    const hoverAnimation = {
        rotate: [-1, 1, -1, 0],
        scale: 1.05,
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut" as const,
        }
    };

    return (
        <motion.div
            className={`flex items-center space-x-3 p-4 rounded-xl shadow-lg border-b-4 border-${color}-600 bg-white dark:bg-gray-800 cursor-default`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: delay }}
            viewport={{ once: true }}
            whileHover={hoverAnimation}
        >
            <Icon className={`w-6 h-6 text-${color}-600`} />
            <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
        </motion.div>
    );
});

export { TechBadge };