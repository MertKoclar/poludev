import React from 'react';
import { motion } from 'framer-motion';
import { TeamMemberCard } from './TeamMemberCard';

const AboutSection = () => {
  const teamMembers = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & Baş Geliştirici",
      bio: "10+ yıllık deneyime sahip full-stack geliştirici. React ve Node.js konusunda uzman.",
      image: "",
      socialLinks: [
        { icon: "Github", url: "#" },
        { icon: "Linkedin", url: "#" },
        { icon: "Twitter", url: "#" }
      ]
    },
    {
      name: "Elif Demir",
      role: "UI/UX Tasarımcı",
      bio: "Kullanıcı deneyimi odaklı tasarımcı. Modern ve kullanıcı dostu arayüzler oluşturur.",
      image: "",
      socialLinks: [
        { icon: "Github", url: "#" },
        { icon: "Linkedin", url: "#" },
        { icon: "Twitter", url: "#" }
      ]
    },
    {
      name: "Mehmet Kaya",
      role: "Mobil Geliştirici",
      bio: "Flutter ve React Native konusunda uzman. iOS ve Android platformlarında uygulamalar geliştirir.",
      image: "",
      socialLinks: [
        { icon: "Github", url: "#" },
        { icon: "Linkedin", url: "#" },
        { icon: "Twitter", url: "#" }
      ]
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-800 transition-colors duration-500" id="hakkimizda">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Hakkımızda
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Deneyimli ve tutkulu bir yazılım geliştirme ekibiyiz.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            2018 yılında kurulan Poludev olarak, müşterilerimize yenilikçi ve kaliteli yazılım çözümleri sunmaktayız. 
            Ekibimiz, web ve mobil uygulama geliştirme konularında uzmanlaşmış, deneyimli geliştiricilerden oluşur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;