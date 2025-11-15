import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import { USER_IDS, USER_NAMES } from '../config/constants';
import type { AboutUs, User } from '../types';
import { SkillsSection } from '../components/SkillsSection';
import { ProfileImage } from '../components/ProfileImage';
import { SocialLinks } from '../components/SocialLinks';
import { Timeline } from '../components/Timeline';
import { Testimonials } from '../components/Testimonials';
import { ContactInfo } from '../components/ContactInfo';
import { SEO } from '../components/SEO';
import { Code, User as UserIcon, Award, Briefcase, GraduationCap, Heart, Briefcase as BriefcaseIcon, FileText, ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mertData, setMertData] = useState<AboutUs | null>(null);
  const [mustafaData, setMustafaData] = useState<AboutUs | null>(null);
  const [mertUser, setMertUser] = useState<User | null>(null);
  const [mustafaUser, setMustafaUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
    fetchUsers();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('*');

      if (error) throw error;

      if (data) {
        const mert = data.find((item) => item.user_id === USER_IDS.MERT);
        const mustafa = data.find((item) => item.user_id === USER_IDS.MUSTAFA);
        setMertData(mert || null);
        setMustafaData(mustafa || null);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('id', [USER_IDS.MERT, USER_IDS.MUSTAFA]);

      if (error) throw error;

      if (data) {
        const mert = data.find((user) => user.id === USER_IDS.MERT);
        const mustafa = data.find((user) => user.id === USER_IDS.MUSTAFA);
        setMertUser(mert || null);
        setMustafaUser(mustafa || null);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const lang = i18n.language as 'tr' | 'en';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentLocale = i18n.language || 'en';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Poludev',
      alternateName: 'Poludev - Mert & Mustafa',
      url: `${siteUrl}${location.pathname}`,
      description: t('about.heroDescription') || 'Passionate developers creating innovative solutions',
      founders: [
        {
          '@type': 'Person',
          name: mertUser?.name || 'Mert',
          jobTitle: 'Full-stack Developer',
        },
        {
          '@type': 'Person',
          name: mustafaUser?.name || 'Mustafa',
          jobTitle: 'Full-stack Developer',
        },
      ],
    },
  };

  const alternateLocales = [
    { locale: 'en', url: `${siteUrl}/about` },
    { locale: 'tr', url: `${siteUrl}/tr/about` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto animate-pulse" />
            </div>
          </div>
        </section>

        {/* Team Members Skeleton */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 animate-pulse" />
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const teamMembers = [
    {
      name: t('about.mert.name'),
      data: mertData,
      user: mertUser,
      fallbackBio: t('about.mert.bio'),
      color: 'blue',
      icon: Code,
      cvRoute: USER_NAMES.MERT,
    },
    {
      name: t('about.mustafa.name'),
      data: mustafaData,
      user: mustafaUser,
      fallbackBio: t('about.mustafa.bio'),
      color: 'green',
      icon: Briefcase,
      cvRoute: USER_NAMES.MUSTAFA,
    },
  ];

  return (
    <>
      <SEO
        title={t('about.title') || 'About Us'}
        description={t('about.heroDescription') || 'Passionate developers creating innovative solutions'}
        keywords="about us, Mert, Mustafa, full-stack developers, web developers, React developers, TypeScript developers, software developers, Poludev"
        url={`${siteUrl}${location.pathname}`}
        type="website"
        locale={currentLocale}
        alternateLocales={alternateLocales}
        structuredData={structuredData}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <UserIcon className="w-16 h-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about.heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-0" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Profile Image and Name */}
                      <div className="flex flex-col items-center text-center mb-6">
                        <ProfileImage
                          imageUrl={member.data?.profile_image_url}
                          name={member.name}
                          size="lg"
                          className="mb-4"
                        />
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {member.name}
                        </h2>
                        
                        {/* Social Links */}
                        {member.data && member.data.social_links && member.data.social_links.length > 0 && (
                          <div className="mb-4">
                            <SocialLinks links={member.data.social_links} size="sm" variant="minimal" />
                          </div>
                        )}

                        {/* CV Download Button */}
                        {member.user && member.user.cv_url && (
                          <div className="mb-4 flex gap-3 justify-center">
                            <Link
                              to={`/cv/${member.cvRoute}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              <FileText className="w-4 h-4" />
                              {t('cv.download') || 'Download CV'}
                            </Link>
                            <a
                              href={member.user.cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                              title={t('cv.view') || 'View CV'}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      <div className="mb-6">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          {member.data
                            ? lang === 'tr'
                              ? member.data.bio_tr
                              : member.data.bio_en
                            : member.fallbackBio}
                        </p>
                      </div>

                      {/* Skills */}
                      {member.data && member.data.skills.length > 0 && (
                        <SkillsSection
                          skills={member.data.skills}
                          color={member.color}
                        />
                      )}

                      {/* Contact Info */}
                      {(member.data?.contact_email || member.data?.contact_phone || member.data?.location) && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                          {member.data.contact_email && (
                            <a 
                              href={`mailto:${member.data.contact_email}`}
                              className="block text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              📧 {member.data.contact_email}
                            </a>
                          )}
                          {member.data.contact_phone && (
                            <a 
                              href={`tel:${member.data.contact_phone}`}
                              className="block text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              📞 {member.data.contact_phone}
                            </a>
                          )}
                          {member.data.location && (
                            <p className="text-gray-600 dark:text-gray-400">
                              📍 {member.data.location}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section - Education & Experience */}
      {(mertData?.education?.length || mertData?.experience?.length || 
        mustafaData?.education?.length || mustafaData?.experience?.length) && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Mert Timeline */}
              {(mertData?.education?.length || mertData?.experience?.length) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    {t('about.mert.name')}
                  </h3>
                  <Timeline
                    items={[
                      ...(mertData.experience?.map((exp) => ({
                        ...exp,
                        title: exp.company,
                        subtitle: exp.position,
                        description: lang === 'tr' ? exp.description_tr : exp.description_en,
                        date: exp.start_date,
                        endDate: exp.end_date,
                        current: exp.current,
                        type: 'experience' as const,
                        icon: <BriefcaseIcon className="w-5 h-5" />,
                      })) || []),
                      ...(mertData.education?.map((edu) => ({
                        ...edu,
                        title: edu.institution,
                        subtitle: `${edu.degree} - ${edu.field}`,
                        description: lang === 'tr' ? edu.description_tr : edu.description_en,
                        date: edu.start_date,
                        endDate: edu.end_date,
                        type: 'education' as const,
                        icon: <GraduationCap className="w-5 h-5" />,
                      })) || []),
                    ]}
                  />
                </motion.div>
              )}

              {/* Mustafa Timeline */}
              {(mustafaData?.education?.length || mustafaData?.experience?.length) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    {t('about.mustafa.name')}
                  </h3>
                  <Timeline
                    items={[
                      ...(mustafaData.experience?.map((exp) => ({
                        ...exp,
                        title: exp.company,
                        subtitle: exp.position,
                        description: lang === 'tr' ? exp.description_tr : exp.description_en,
                        date: exp.start_date,
                        endDate: exp.end_date,
                        current: exp.current,
                        type: 'experience' as const,
                        icon: <BriefcaseIcon className="w-5 h-5" />,
                      })) || []),
                      ...(mustafaData.education?.map((edu) => ({
                        ...edu,
                        title: edu.institution,
                        subtitle: `${edu.degree} - ${edu.field}`,
                        description: lang === 'tr' ? edu.description_tr : edu.description_en,
                        date: edu.start_date,
                        endDate: edu.end_date,
                        type: 'education' as const,
                        icon: <GraduationCap className="w-5 h-5" />,
                      })) || []),
                    ]}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {(mertData?.certifications?.length || mustafaData?.certifications?.length) && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('about.certifications.title') || 'Certifications'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('about.certifications.subtitle') || 'Professional certifications and credentials'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[mertData, mustafaData].map((data, index) => {
                if (!data?.certifications?.length) return null;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      {index === 0 ? t('about.mert.name') : t('about.mustafa.name')}
                    </h3>
                    <div className="space-y-4">
                      {data.certifications.map((cert, certIndex) => (
                        <motion.div
                          key={cert.id || certIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: certIndex * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {cert.name}
                              </h4>
                              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                                {cert.issuer}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                  Issued: {new Date(cert.issue_date).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </span>
                                {cert.expiry_date && (
                                  <span>
                                    Expires: {new Date(cert.expiry_date).toLocaleDateString('en-US', { 
                                      month: 'long', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                )}
                              </div>
                              {cert.credential_id && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  Credential ID: {cert.credential_id}
                                </p>
                              )}
                              {cert.credential_url && (
                                <a
                                  href={cert.credential_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                >
                                  View Credential →
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {(mertData?.testimonials?.length || mustafaData?.testimonials?.length) && (
        <Testimonials 
          testimonials={[
            ...(mertData?.testimonials || []).map((t, i) => {
              // Create unique ID by combining user prefix with original ID and index
              const uniqueId = `mert-${t.id ? `${t.id}-` : ''}${i}`;
              return { 
                ...t, 
                id: uniqueId 
              };
            }),
            ...(mustafaData?.testimonials || []).map((t, i) => {
              // Create unique ID by combining user prefix with original ID and index
              const uniqueId = `mustafa-${t.id ? `${t.id}-` : ''}${i}`;
              return { 
                ...t, 
                id: uniqueId 
              };
            })
          ]} 
        />
      )}

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('values.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('values.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Code, titleKey: 'values.innovation.title', descriptionKey: 'values.innovation.description' },
              { icon: Heart, titleKey: 'values.passion.title', descriptionKey: 'values.passion.description' },
              { icon: Award, titleKey: 'values.excellence.title', descriptionKey: 'values.excellence.description' },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t(value.titleKey)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(value.descriptionKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <ContactInfo
        email={mertData?.contact_email || mustafaData?.contact_email}
        phone={mertData?.contact_phone || mustafaData?.contact_phone}
        location={mertData?.location || mustafaData?.location}
      />
      </div>
    </>
  );
};
