import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Code, Smartphone, TrendingUp, Layers, Users } from 'lucide-react';
import { TechBadge } from './TechBadge';

const TechStackSection = () => {
    const technologies = [
        { icon: Zap, name: 'React', color: 'blue', delay: 0.1 },
        { icon: Code, name: 'Node.js', color: 'green', delay: 0.2 },
        { icon: Smartphone, name: 'Flutter', color: 'sky', delay: 0.3 },
        { icon: TrendingUp, name: 'TypeScript', color: 'blue', delay: 0.4 },
        { icon: Layers, name: 'Express.js', color: 'gray', delay: 0.5 },
        { icon: Users, name: 'MongoDB/PostgreSQL', color: 'yellow', delay: 0.6 },
    ];

    return (
        <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" id="teknolojiler">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Kullandığımız Teknoloji Yığını
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Projelerimizde en iyi performansı ve ölçeklenebilirliği sağlamak için modern ve kanıtlanmış araçları kullanıyoruz.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {technologies.map((tech) => (
                        <TechBadge key={tech.name} {...tech} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStackSection;