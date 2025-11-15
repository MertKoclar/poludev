import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import type { Project } from '../types';
import { ExternalLink, Github, ArrowLeft, Calendar, Code2, Star, GitFork, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Lightbox } from '../components/Lightbox';
import { SkeletonCard } from '../components/Skeleton';
import { SEO } from '../components/SEO';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data as Project);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const lang = i18n.language as 'tr' | 'en';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentLocale = i18n.language || 'en';

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          label: t('projects.status.active') || 'Active',
          color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          label: t('projects.status.completed') || 'Completed',
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        };
      case 'in-development':
        return {
          icon: Clock,
          label: t('projects.status.inDevelopment') || 'In Development',
          color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        };
      case 'on-hold':
        return {
          icon: AlertCircle,
          label: t('projects.status.onHold') || 'On Hold',
          color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400',
        };
      default:
        return null;
    }
  };

  const getCategoryLabel = (category?: string) => {
    if (!category) return null;
    return t(`projects.category.${category}`) || category;
  };

  const openLightbox = (index: number = 0) => {
    if (project?.image_url) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('projects.notFound') || 'Project Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('projects.notFoundDescription') || 'The project you are looking for does not exist.'}
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('projects.backToProjects') || 'Back to Projects'}
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const images = project.image_url ? [project.image_url] : [];

  const projectTitle = lang === 'tr' ? project.title_tr : project.title_en;
  const projectDescription = lang === 'tr' ? project.description_tr : project.description_en;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: projectTitle,
    description: projectDescription,
    url: `${siteUrl}${location.pathname}`,
    image: project.image_url || `${siteUrl}/og-image.jpg`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Poludev',
    },
    datePublished: project.created_at,
    dateModified: project.updated_at || project.created_at,
  };

  const alternateLocales = [
    { locale: 'en', url: `${siteUrl}/projects/${project.id}` },
    { locale: 'tr', url: `${siteUrl}/tr/projects/${project.id}` },
  ];

  return (
    <>
      <SEO
        title={projectTitle}
        description={projectDescription}
        keywords={`${projectTitle}, ${project.tags?.join(', ') || ''}, web development, React, TypeScript, ${project.category || ''}, Poludev`}
        image={project.image_url || undefined}
        url={`${siteUrl}${location.pathname}`}
        type="article"
        publishedTime={project.created_at}
        modifiedTime={project.updated_at || project.created_at}
        locale={currentLocale}
        alternateLocales={alternateLocales}
        structuredData={structuredData}
        canonical={`${siteUrl}/projects/${project.id}`}
      />
      <div className="min-h-screen pt-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('projects.backToProjects') || 'Back to Projects'}
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Status and Category */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {statusConfig && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${statusConfig.color}`}>
                    <statusConfig.icon className="w-4 h-4" />
                    {statusConfig.label}
                  </div>
                )}
                {project.category && (
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
                    {getCategoryLabel(project.category)}
                  </span>
                )}
                {project.featured && (
                  <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium">
                    ⭐ {t('projects.featured') || 'Featured'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
                {lang === 'tr' ? project.title_tr : project.title_en}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {lang === 'tr' ? project.description_tr : project.description_en}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {project.star_count !== undefined && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{project.star_count.toLocaleString()}</span>
                  </div>
                )}
                {project.fork_count !== undefined && (
                  <div className="flex items-center gap-2">
                    <GitFork className="w-5 h-5" />
                    <span>{project.fork_count.toLocaleString()}</span>
                  </div>
                )}
                {project.view_count !== undefined && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{project.view_count.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {t('projects.viewLive')}
                  </motion.a>
                )}
                {project.github_url && (
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    {t('projects.viewCode')}
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Image */}
      {project.image_url && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <motion.img
                src={project.image_url}
                alt={lang === 'tr' ? project.title_tr : project.title_en}
                onClick={() => openLightbox(0)}
                className="w-full rounded-2xl shadow-2xl cursor-zoom-in hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Tags Section */}
      {project.tags.length > 0 && (
        <section className="py-10 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('projects.technologies') || 'Technologies Used'}
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        currentIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
      />
      </div>
    </>
  );
};

