import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import type { Project, ProjectStatus, ProjectCategory } from '../types';
import { ExternalLink, Github, Search, X, Code2, ArrowUpDown, Star, GitFork, Eye, ZoomIn } from 'lucide-react';
import { SkeletonProjectCard } from '../components/Skeleton';
import { Lightbox } from '../components/Lightbox';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'popular';

export const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, selectedTag, selectedCategory, selectedStatus, sortBy, i18n.language]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((project) => {
        const lang = i18n.language as 'tr' | 'en';
        const title = lang === 'tr' ? project.title_tr : project.title_en;
        const description = lang === 'tr' ? project.description_tr : project.description_en;
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((project) => project.tags.includes(selectedTag));
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((project) => project.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter((project) => project.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      const lang = i18n.language as 'tr' | 'en';
      
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name-asc':
          const titleA = (lang === 'tr' ? a.title_tr : a.title_en).toLowerCase();
          const titleB = (lang === 'tr' ? b.title_tr : b.title_en).toLowerCase();
          return titleA.localeCompare(titleB);
        case 'name-desc':
          const titleADesc = (lang === 'tr' ? a.title_tr : a.title_en).toLowerCase();
          const titleBDesc = (lang === 'tr' ? b.title_tr : b.title_en).toLowerCase();
          return titleBDesc.localeCompare(titleADesc);
        case 'popular':
          const aPopularity = (a.star_count || 0) + (a.fork_count || 0) + (a.view_count || 0);
          const bPopularity = (b.star_count || 0) + (b.fork_count || 0) + (b.view_count || 0);
          return bPopularity - aPopularity;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const allCategories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as ProjectCategory[];
  const allStatuses = Array.from(new Set(projects.map((p) => p.status).filter(Boolean))) as ProjectStatus[];

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  const lang = i18n.language as 'tr' | 'en';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentLocale = i18n.language || 'en';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('projects.title') || 'Projects',
    description: t('projects.description') || 'Web geliştirme projelerimizin portföyü. React, TypeScript ve modern teknolojilerle geliştirilmiş projeler.',
    url: `${siteUrl}${location.pathname}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredProjects.length,
      itemListElement: filteredProjects.slice(0, 10).map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: lang === 'tr' ? project.title_tr : project.title_en,
          description: lang === 'tr' ? project.description_tr : project.description_en,
          url: `${siteUrl}/projects/${project.id}`,
          applicationCategory: 'WebApplication',
          operatingSystem: 'Web',
        },
      })),
    },
  };

  const alternateLocales = [
    { locale: 'en', url: `${siteUrl}/projects` },
    { locale: 'tr', url: `${siteUrl}/tr/projects` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <section className="relative py-32 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto animate-pulse" />
            </div>
          </div>
        </section>

        {/* Projects Section Skeleton */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonProjectCard key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={t('projects.title') || 'Projects'}
        description={t('projects.description') || 'Web geliştirme projelerimizin portföyü. React, TypeScript ve modern teknolojilerle geliştirilmiş projeler.'}
        keywords="projeler, portföy, web geliştirme, React projeleri, TypeScript projeleri, web uygulamaları, yazılım projeleri, Poludev projeleri"
        url={`${siteUrl}${location.pathname}`}
        type="website"
        locale={currentLocale}
        alternateLocales={alternateLocales}
        structuredData={structuredData}
      />
      <div className="min-h-screen">
        {/* Breadcrumb Section */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-20 pb-3">
          <div className="container mx-auto px-4">
            <Breadcrumb
              items={[
                { label: t('common.home') || 'Home', path: '/' },
                { label: t('projects.title') || 'Projects', path: '/projects' },
              ]}
            />
          </div>
        </div>
        {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-amber-300 dark:bg-amber-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20"
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
              <Code2 className="w-16 h-16 mx-auto mb-6 text-orange-600 dark:text-orange-400" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 dark:from-orange-400 dark:via-orange-500 dark:to-amber-500">
              {t('projects.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('projects.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-12"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search') || 'Search projects...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap items-center gap-4 justify-center mb-6">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm font-medium">{t('projects.sortBy') || 'Sort by:'}</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="newest">{t('projects.sort.newest') || 'Newest First'}</option>
                <option value="oldest">{t('projects.sort.oldest') || 'Oldest First'}</option>
                <option value="name-asc">{t('projects.sort.nameAsc') || 'Name (A-Z)'}</option>
                <option value="name-desc">{t('projects.sort.nameDesc') || 'Name (Z-A)'}</option>
                <option value="popular">{t('projects.sort.popular') || 'Most Popular'}</option>
              </select>
            </div>

            {/* Category Filter */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedCategory === null
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('projects.allCategories') || 'All Categories'}
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t(`projects.category.${category}`) || category}
                  </button>
                ))}
              </div>
            )}

            {/* Status Filter */}
            {allStatuses.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                <button
                  onClick={() => setSelectedStatus(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedStatus === null
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('projects.allStatuses') || 'All Statuses'}
                </button>
                {allStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                      selectedStatus === status
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t(`projects.status.${status}`) || status}
                  </button>
                ))}
              </div>
            )}

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedTag === null
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('projects.all')}
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                      selectedTag === tag
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {projects.length === 0 ? t('projects.noProjects') : t('projects.noProjectsFound')}
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    {/* Project Image */}
                    {project.image_url ? (
                      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => {
                        setLightboxImage(project.image_url!);
                        setLightboxOpen(true);
                      }}>
                        <motion.img
                          src={project.image_url}
                          alt={lang === 'tr' ? project.title_tr : project.title_en}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-3">
                            {project.live_url && (
                              <motion.a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {t('projects.viewLive')}
                              </motion.a>
                            )}
                            {project.github_url && (
                              <motion.a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                              >
                                <Github className="w-4 h-4" />
                                {t('projects.code')}
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                        <Code2 className="w-20 h-20 text-white opacity-50" />
                      </div>
                    )}

                    {/* Project Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer flex-1"
                        >
                          {lang === 'tr' ? project.title_tr : project.title_en}
                        </h3>
                        {project.featured && (
                          <span className="text-yellow-400 text-xl ml-2">⭐</span>
                        )}
                      </div>

                      {/* Status and Category */}
                      {(project.status || project.category) && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === 'active' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : project.status === 'completed'
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                : project.status === 'in-development'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                            }`}>
                              {t(`projects.status.${project.status}`) || project.status}
                            </span>
                          )}
                          {project.category && (
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                              {t(`projects.category.${project.category}`) || project.category}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                        {lang === 'tr' ? project.description_tr : project.description_en}
                      </p>

                      {/* Stats */}
                      {(project.star_count !== undefined || project.fork_count !== undefined || project.view_count !== undefined) && (
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                          {project.star_count !== undefined && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{project.star_count.toLocaleString()}</span>
                            </div>
                          )}
                          {project.fork_count !== undefined && (
                            <div className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              <span>{project.fork_count.toLocaleString()}</span>
                            </div>
                          )}
                          {project.view_count !== undefined && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{project.view_count.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            onClick={() => setSelectedTag(tag)}
                            className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Links (visible on mobile) */}
                      <div className="flex gap-4 md:hidden">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm"
                          >
                            <Github className="w-4 h-4" />
                            {t('projects.code')}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImage ? [lightboxImage] : []}
        currentIndex={0}
      />
      </div>
    </>
  );
};
