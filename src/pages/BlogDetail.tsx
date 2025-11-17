import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../config/supabaseClient';
import type { BlogPost } from '../types';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, Tag, Download, ArrowLeft, Share2 } from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language as 'tr' | 'en';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousLang, setPreviousLang] = useState<string>(lang);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Handle language change - redirect to correct slug
  useEffect(() => {
    if (lang !== previousLang && post) {
      const correctSlug = lang === 'tr' ? post.slug_tr : post.slug_en;
      if (correctSlug && correctSlug !== slug) {
        navigate(`/blog/${correctSlug}`, { replace: true });
      }
      setPreviousLang(lang);
    } else if (lang !== previousLang) {
      setPreviousLang(lang);
    }
  }, [lang, post, slug, navigate, previousLang]);

  useEffect(() => {
    if (post) {
      incrementViewCount();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to find post by either slug_tr or slug_en
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .or(`slug_tr.eq.${slug},slug_en.eq.${slug}`)
        .eq('published', true)
        .single();

      if (fetchError) throw fetchError;
      if (!data) {
        setError('Post not found');
        return;
      }
      
      setPost(data);
      
      // If the current slug doesn't match the current language, redirect
      const currentSlug = lang === 'tr' ? data.slug_tr : data.slug_en;
      if (currentSlug && currentSlug !== slug) {
        navigate(`/blog/${currentSlug}`, { replace: true });
      }
    } catch (err: any) {
      console.error('Error fetching blog post:', err);
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    if (!post) return;
    try {
      await supabase
        .from('blog_posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', post.id);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
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

  const getCategoryLabel = (category: string | undefined) => {
    if (!category) return '';
    return t(`blog.categories.${category}`) || category;
  };

  const getPostTitle = (post: BlogPost) => {
    return lang === 'tr' ? post.title_tr : post.title_en;
  };

  const getPostContent = (post: BlogPost) => {
    return lang === 'tr' ? post.content_tr : post.content_en;
  };

  const getDownloadLabel = () => {
    return t('blog.downloadFile') || t('blog.download') || 'Download';
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: getPostTitle(post),
          text: post.excerpt_tr || post.excerpt_en || '',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('blog.linkCopied') || 'Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('blog.notFound') || 'Post Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('blog.notFoundDescription') || 'The blog post you are looking for does not exist.'}
          </p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('blog.backToBlog') || 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const postTitle = getPostTitle(post);
  const postContent = getPostContent(post);
  const postExcerpt = lang === 'tr' ? post.excerpt_tr : post.excerpt_en;

  // SEO structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postTitle,
    description: postExcerpt || '',
    image: post.featured_image_url || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: 'Poludev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Poludev',
    },
  };

  const currentLocale = lang;
  const currentSlug = post ? (lang === 'tr' ? post.slug_tr : post.slug_en) : slug;
  const alternateLocales = post
    ? lang === 'tr'
      ? [{ locale: 'en', url: `${window.location.origin}/blog/${post.slug_en}` }]
      : [{ locale: 'tr', url: `${window.location.origin}/blog/${post.slug_tr}` }]
    : [];

  return (
    <>
      <SEO
        title={postTitle}
        description={postExcerpt || ''}
        keywords={post.tags.join(', ')}
        image={post.featured_image_url || undefined}
        url={`${window.location.origin}/blog/${currentSlug}`}
        type="article"
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
                { label: postTitle, path: `/blog/${currentSlug}` },
              ]}
            />
          </div>
        </div>
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
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
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20"
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Back Button */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-6 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{t('blog.backToBlog') || 'Back to Blog'}</span>
              </Link>

              {/* Category Badge */}
              {post.category && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6"
                >
                  {getCategoryLabel(post.category)}
                </motion.span>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 dark:from-orange-400 dark:via-orange-500 dark:to-amber-500">
                {postTitle}
              </h1>

              {/* Excerpt */}
              {postExcerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {postExcerpt}
                </p>
              )}

              {/* Meta Info Bar */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                {post.published_at && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">{formatDate(post.published_at)}</span>
                  </div>
                )}
                {post.view_count !== undefined && post.view_count > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">{post.view_count} {t('blog.views') || 'views'}</span>
                  </div>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  {t('blog.share') || 'Share'}
                </button>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5 text-orange-500" />
                      {tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Download Button */}
              {post.download_url && (
                <motion.a
                  href={post.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  {getDownloadLabel()}
                </motion.a>
              )}
            </motion.div>
          </div>
        </section>

        {/* Featured Image Section */}
        {post.featured_image_url && (
          <section className="py-8 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={post.featured_image_url}
                    alt={postTitle}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-700 dark:text-gray-200"
              >
                <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-headings:mt-8 prose-headings:mb-4
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                  prose-code:text-orange-600 dark:prose-code:text-orange-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 dark:prose-code:text-orange-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800 dark:prose-pre:text-gray-100
                  prose-pre-code:text-gray-100 dark:prose-pre-code:text-gray-100
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-orange-500
                  prose-blockquote:bg-orange-50 dark:prose-blockquote:bg-orange-900/20
                  prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6
                  prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200
                  prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8
                  prose-table:border-collapse prose-table:w-full
                  prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 dark:prose-th:text-gray-200 prose-th:p-3
                  prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 dark:prose-td:text-gray-200 prose-td:p-3
                  prose-em:text-gray-700 dark:prose-em:text-gray-200
                  prose-del:text-gray-600 dark:prose-del:text-gray-400
                  prose-mark:text-gray-900 dark:prose-mark:text-gray-100 prose-mark:bg-yellow-200 dark:prose-mark:bg-yellow-800
                  [&>*]:text-gray-700 dark:[&>*]:text-gray-200
                  [&>p]:text-gray-700 dark:[&>p]:text-gray-200
                  [&>ul]:text-gray-700 dark:[&>ul]:text-gray-200
                  [&>ol]:text-gray-700 dark:[&>ol]:text-gray-200
                  [&>li]:text-gray-700 dark:[&>li]:text-gray-200
                  [&>blockquote]:text-gray-700 dark:[&>blockquote]:text-gray-200
                  [&>h1]:text-gray-900 dark:[&>h1]:text-white
                  [&>h2]:text-gray-900 dark:[&>h2]:text-white
                  [&>h3]:text-gray-900 dark:[&>h3]:text-white
                  [&>h4]:text-gray-900 dark:[&>h4]:text-white
                  [&>h5]:text-gray-900 dark:[&>h5]:text-white
                  [&>h6]:text-gray-900 dark:[&>h6]:text-white"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {postContent}
                  </ReactMarkdown>
                </div>
              </motion.div>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors font-medium group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>{t('blog.backToBlog') || 'Back to Blog'}</span>
                  </Link>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    <Share2 className="w-5 h-5" />
                    {t('blog.share') || 'Share'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

