import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code, Users, Rocket, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

export const StatisticsSection: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    experience: 5,
    awards: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id', { count: 'exact' });

      if (!error && data) {
        setStats((prev) => ({ ...prev, projects: data.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statistics = [
    {
      icon: Rocket,
      value: stats.projects,
      labelKey: 'statistics.projects',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      value: stats.clients || 50,
      labelKey: 'statistics.happyClients',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Code,
      value: `${stats.experience}+`,
      labelKey: 'statistics.yearsExperience',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: Award,
      value: stats.awards || 10,
      labelKey: 'statistics.awards',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {t(stat.labelKey)}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

