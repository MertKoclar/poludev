import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';

const PortfolioSection = () => {
  const projects = [
    {
      title: "E-Ticaret Platformu",
      description: "Tam özellikli bir e-ticaret çözümü, ödeme entegrasyonu ve envanter yönetimi ile.",
      technologies: ["React", "Node.js", "MongoDB"],
      delay: 0.1
    },
    {
      title: "Mobil Bankacılık Uygulaması",
      description: "Güvenli ve kullanıcı dostu bir mobil bankacılık deneyimi.",
      technologies: ["Flutter", "Firebase", "Dart"],
      delay: 0.2
    },
    {
      title: "Kurumsal Yönetim Sistemi",
      description: "Çalışan yönetimi ve proje takibi için kapsamlı bir çözüm.",
      technologies: ["React", "Express", "PostgreSQL"],
      delay: 0.3
    },
    {
      title: "Sağlık Takip Uygulaması",
      description: "Hastaların sağlık verilerini takip edebileceği bir mobil uygulama.",
      technologies: ["React Native", "Node.js", "MongoDB"],
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" id="projeler">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Projelerimiz
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Müşterilerimize sunduğumuz yenilikçi çözümlerden bazı örnekler.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} title={project.title} description={project.description} technologies={project.technologies} delay={project.delay} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;