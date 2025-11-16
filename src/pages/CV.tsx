import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import type { User } from '../types';

export const CV: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCV();
  }, [name]);

  const fetchUserCV = async () => {
    try {
      // Assuming name parameter is 'mert' or 'mustafa'
      // You may need to adjust this query based on your user identification logic
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('name', `%${name}%`)
        .single();

      if (error) throw error;
      setUser(data as User);
    } catch (error) {
      console.error('Error fetching user CV:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  if (!user || !user.cv_url) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{t('cv.title')} {t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {name === 'mert' ? t('cv.mert') : t('cv.mustafa')}
        </h1>
        <div className="space-y-4">
          <a
            href={user.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold"
          >
            {t('cv.download')}
          </a>
          <div className="mt-8">
            <iframe
              src={user.cv_url}
              className="w-full h-screen border border-gray-300 dark:border-gray-700 rounded-lg"
              title={t('cv.title')}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

