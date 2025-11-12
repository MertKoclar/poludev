import React from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

const ServicesSection = () => {
    const services = [
        {
            icon: Code,
            title: 'Full Stack Web Geliştirme',
            description: 'Uçtan uca kapsamlı web uygulamaları için modern mimariler ve ölçeklenebilir çözümler sunuyoruz. Frontend (React) ve Backend (Node.js, Express) yetkinliklerimizle projenizi başarıya taşıyoruz.',
            features: [
                'Özel Mimariler ve API Gelişimi',
                'E-ticaret ve Kurumsal Çözümler',
                'Veritabanı Tasarımı ve Optimizasyonu',
            ],
            delay: 0.1,
        },
        {
            icon: Smartphone,
            title: 'Mobil Uygulama Geliştirme',
            description: 'iOS ve Android platformları için hızlı, estetik ve kullanıcı odaklı mobil deneyimler yaratıyoruz. Markanızın mobil dünyadaki varlığını güçlendirin.',
            features: [
                'Cross-Platform (Flutter) Uygulamalar',
                'Native Performans ve Deneyim',
                'API Entegrasyonu ve Yayınlama Desteği',
            ],
            delay: 0.3,
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-white dark:bg-gray-900 transition-colors duration-500" id="hizmetler">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Çözüm Sunduğumuz Alanlar
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Dijital dönüşümünüzü hızlandıracak yenilikçi ve güvenilir yazılım hizmetleri.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;