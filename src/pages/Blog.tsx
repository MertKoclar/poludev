import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import type { BlogPost, BlogCategory } from '../types';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { Calendar, Clock, Tag, Download, ArrowRight, Search, Filter } from 'lucide-react';

export const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'tr' | 'en';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');

  const categories: BlogCategory[] = ['general', 'tutorial', 'project', 'news', 'tips', 'other'];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory, lang]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const title = lang === 'tr' ? post.title_tr : post.title_en;
        const excerpt = lang === 'tr' ? post.excerpt_tr : post.excerpt_en;
        const content = lang === 'tr' ? post.content_tr : post.content_en;
        return (
          title.toLowerCase().includes(query) ||
          excerpt?.toLowerCase().includes(query) ||
          content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryLabel = (category: BlogCategory) => {
    return t(`blog.categories.${category}`) || category;
  };

  const getPostSlug = (post: BlogPost) => {
    return lang === 'tr' ? post.slug_tr : post.slug_en;
  };

  const getPostTitle = (post: BlogPost) => {
    return lang === 'tr' ? post.title_tr : post.title_en;
  };

  const getPostExcerpt = (post: BlogPost) => {
    return lang === 'tr' ? post.excerpt_tr : post.excerpt_en;
  };

  const getDownloadLabel = (post: BlogPost) => {
    return lang === 'tr' ? post.download_label_tr : post.download_label_en;
  };

  // SEO structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('blog.title') || 'Blog',
    description: t('blog.description') || 'Blog yazıları ve makaleler. Web geliştirme, teknoloji ve yazılım dünyasından güncel içerikler.',
    url: window.location.origin + '/blog',
  };

  const currentLocale = lang;
  const alternateLocales = lang === 'tr' 
    ? [{ locale: 'en', url: `${window.location.origin}/blog` }]
    : [{ locale: 'tr', url: `${window.location.origin}/blog` }];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={t('blog.title') || 'Blog'}
        description={t('blog.description') || 'Blog yazıları ve makaleler. Web geliştirme, teknoloji ve yazılım dünyasından güncel içerikler.'}
        keywords={t('blog.keywords') || 'blog, makaleler, yazılar, web geliştirme, teknoloji, yazılım'}
        url={`${window.location.origin}/blog`}
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
                { label: t('blog.title') || 'Blog', path: '/blog' },
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
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 dark:from-orange-400 dark:via-orange-500 dark:to-amber-500">
                {t('blog.title') || 'Blog'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('blog.description') || 'Read our latest articles, tutorials, and insights'}
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('blog.searchPlaceholder') || 'Search posts...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as BlogCategory | 'all')}
                    className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">{t('blog.allCategories') || 'All Categories'}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Featured Image */}
                    {post.featured_image_url && (
                      <Link to={`/blog/${getPostSlug(post)}`}>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.featured_image_url}
                            alt={getPostTitle(post)}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                    )}

                    <div className="p-6">
                      {/* Category */}
                      {post.category && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
                          {getCategoryLabel(post.category)}
                        </span>
                      )}

                      {/* Title */}
                      <Link to={`/blog/${getPostSlug(post)}`}>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                          {getPostTitle(post)}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      {getPostExcerpt(post) && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {getPostExcerpt(post)}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {post.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        )}
                        {post.view_count !== undefined && post.view_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.view_count} {t('blog.views') || 'views'}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/blog/${getPostSlug(post)}`}
                          className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                        >
                          {t('blog.readMore') || 'Read More'}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        {post.download_url && (
                          <a
                            href={post.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                          >
                            <Download className="w-4 h-4" />
                            {getDownloadLabel(post) || t('blog.download') || 'Download'}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('blog.noPosts') || 'No blog posts found'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

