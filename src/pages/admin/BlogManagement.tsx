import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import type { BlogPost, BlogCategory } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { STORAGE_BUCKETS } from '../../config/constants';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { MarkdownEditor } from '../../components/editor/MarkdownEditor';
import { slugify } from '../../utils/slugify';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import { Trash2, Edit, Eye, CheckSquare, Square, ExternalLink, Download, Calendar, Tag } from 'lucide-react';

export const BlogManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      logError(err, 'fetchPosts');
      error(getErrorMessage(err, t('admin.errorFetchingBlogPosts') || 'Failed to fetch blog posts'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm') || 'Are you sure you want to delete this post?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      success(t('admin.blogPostDeleted') || 'Blog post deleted successfully');
      fetchPosts();
      setSelectedPosts(new Set());
    } catch (err: any) {
      logError(err, 'handleDelete');
      error(getErrorMessage(err, t('admin.errorDeletingBlogPost') || 'Failed to delete blog post'));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;
    if (!confirm(t('admin.bulkDeleteConfirm') || `Are you sure you want to delete ${selectedPosts.size} posts?`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', Array.from(selectedPosts));

      if (deleteError) throw deleteError;
      success(t('admin.blogPostsDeleted') || `${selectedPosts.size} posts deleted successfully`);
      fetchPosts();
      setSelectedPosts(new Set());
    } catch (err: any) {
      console.error('Error deleting posts:', err);
      error(err.message || 'Failed to delete posts');
    }
  };

  const toggleSelectPost = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map(p => p.id)));
    }
  };

  const getCategoryLabel = (category: BlogCategory) => {
    return t(`blog.categories.${category}`) || category;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('admin.blogManagement') || 'Blog Management'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.manageBlogPosts') || 'Manage your blog posts'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {selectedPosts.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.deleteSelected')}</span>
              <span className="sm:hidden">{t('common.delete')}</span>
              <span>({selectedPosts.size})</span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingPost(null);
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm sm:text-base"
          >
            {t('admin.addBlogPost') || 'Add Blog Post'}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {posts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
          >
            {selectedPosts.size === posts.length ? (
              <CheckSquare className="w-5 h-5 text-orange-600" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            <span>{t('admin.selectAll')}</span>
          </button>
          {selectedPosts.size > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400 px-2 py-1 bg-orange-50 dark:bg-orange-600/20 rounded">
              {selectedPosts.size} {t('admin.selected') || 'selected'}
            </span>
          )}
        </div>
      )}

      {showForm && (
        <BlogPostForm
          post={editingPost}
          onClose={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
          onSuccess={() => {
            fetchPosts();
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            {t('admin.noBlogPosts') || 'No blog posts found. Add your first post!'}
          </p>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('admin.addBlogPost') || 'Add Blog Post'}
          </button>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => {
            const lang = i18n.language as 'tr' | 'en';
            const title = lang === 'tr' ? post.title_tr : post.title_en;
            const excerpt = lang === 'tr' ? post.excerpt_tr : post.excerpt_en;
            const slug = lang === 'tr' ? post.slug_tr : post.slug_en;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                  selectedPosts.has(post.id)
                    ? 'border-orange-600 ring-2 ring-orange-600'
                    : 'border-transparent'
                }`}
              >
                {/* Post Image */}
                {post.featured_image_url && (
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <button
                        onClick={() => toggleSelectPost(post.id)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg backdrop-blur-sm"
                      >
                        {selectedPosts.has(post.id) ? (
                          <CheckSquare className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    {!post.published && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
                        {t('admin.draft') || 'Draft'}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Category */}
                  {post.category && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
                      {getCategoryLabel(post.category)}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {title}
                  </h3>

                  {/* Excerpt */}
                  {excerpt && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                      {excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    )}
                    {post.view_count !== undefined && post.view_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.view_count}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
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

                  {/* Download Link Indicator */}
                  {post.download_url && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <Download className="w-4 h-4" />
                      <span>{t('admin.hasDownloadLink') || 'Has download link'}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => setPreviewPost(post)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      {t('common.view')}
                    </button>
                    <button
                      onClick={() => navigate(`/blog/${slug}`)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('admin.preview') || 'Preview'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <Modal
          isOpen={!!previewPost}
          onClose={() => setPreviewPost(null)}
          title={i18n.language === 'tr' ? previewPost.title_tr : previewPost.title_en}
          size="lg"
        >
          <div className="space-y-4">
            {previewPost.featured_image_url && (
              <img
                src={previewPost.featured_image_url}
                alt={i18n.language === 'tr' ? previewPost.title_tr : previewPost.title_en}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('admin.excerpt') || 'Excerpt'} ({i18n.language === 'tr' ? 'TR' : 'EN'})
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {i18n.language === 'tr' ? previewPost.excerpt_tr : previewPost.excerpt_en || '-'}
              </p>
            </div>
            {previewPost.download_url && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {t('admin.downloadLink') || 'Download Link'}
                </h3>
                <a
                  href={previewPost.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  {previewPost.download_url}
                </a>
              </div>
            )}
            {previewPost.tags && previewPost.tags.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {t('admin.tags') || 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {previewPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

interface BlogPostFormProps {
  post: BlogPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    title_tr: post?.title_tr || '',
    title_en: post?.title_en || '',
    slug_tr: post?.slug_tr || '',
    slug_en: post?.slug_en || '',
    excerpt_tr: post?.excerpt_tr || '',
    excerpt_en: post?.excerpt_en || '',
    content_tr: post?.content_tr || '',
    content_en: post?.content_en || '',
    featured_image_url: post?.featured_image_url || '',
    download_url: post?.download_url || '',
    download_label_tr: post?.download_label_tr || '',
    download_label_en: post?.download_label_en || '',
    category: (post?.category || 'general') as BlogCategory,
    tags: post?.tags.join(',') || '',
    published: post?.published || false,
    published_at: post?.published_at || '',
  });
  const [loading, setLoading] = useState(false);
  const [contentEditorMode, setContentEditorMode] = useState<'rich' | 'markdown' | 'plain'>('markdown');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const categories: BlogCategory[] = ['general', 'tutorial', 'project', 'news', 'tips', 'other'];

  // Auto-generate slug from title
  useEffect(() => {
    if (autoGenerateSlug && formData.title_tr) {
      setFormData(prev => ({ ...prev, slug_tr: slugify(formData.title_tr) }));
    }
  }, [formData.title_tr, autoGenerateSlug]);

  useEffect(() => {
    if (autoGenerateSlug && formData.title_en) {
      setFormData(prev => ({ ...prev, slug_en: slugify(formData.title_en) }));
    }
  }, [formData.title_en, autoGenerateSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        published_at: formData.published && formData.published_at ? formData.published_at : (formData.published ? new Date().toISOString() : null),
        author_id: user?.id || null,
      };

      if (post) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        if (error) throw error;
      }

      showSuccess(t('admin.blogPostSaved') || 'Blog post saved successfully');
      onSuccess();
    } catch (err: any) {
      console.error('Error saving blog post:', err);
      logError(err, 'handleSubmit');
      showError(getErrorMessage(err, t('admin.errorSavingBlogPost') || 'Failed to save blog post'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={post ? t('admin.editBlogPost') || 'Edit Blog Post' : t('admin.addBlogPost') || 'Add Blog Post'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
        {/* Title TR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.title') || 'Title'} (TR) *
          </label>
          <input
            type="text"
            value={formData.title_tr}
            onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Title EN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.title') || 'Title'} (EN) *
          </label>
          <input
            type="text"
            value={formData.title_en}
            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Slug TR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.slug') || 'Slug'} (TR) *
            <button
              type="button"
              onClick={() => setAutoGenerateSlug(!autoGenerateSlug)}
              className="ml-2 text-xs text-orange-600 hover:underline"
            >
              {autoGenerateSlug ? t('admin.autoGenerate') || 'Auto' : t('admin.manual') || 'Manual'}
            </button>
          </label>
          <input
            type="text"
            value={formData.slug_tr}
            onChange={(e) => setFormData({ ...formData, slug_tr: slugify(e.target.value) })}
            required
            disabled={autoGenerateSlug}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
          />
        </div>

        {/* Slug EN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.slug') || 'Slug'} (EN) *
          </label>
          <input
            type="text"
            value={formData.slug_en}
            onChange={(e) => setFormData({ ...formData, slug_en: slugify(e.target.value) })}
            required
            disabled={autoGenerateSlug}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
          />
        </div>

        {/* Excerpt TR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.excerpt') || 'Excerpt'} (TR)
          </label>
          <textarea
            value={formData.excerpt_tr}
            onChange={(e) => setFormData({ ...formData, excerpt_tr: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('admin.excerptPlaceholder') || 'Short description for listing...'}
          />
        </div>

        {/* Excerpt EN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.excerpt') || 'Excerpt'} (EN)
          </label>
          <textarea
            value={formData.excerpt_en}
            onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('admin.excerptPlaceholder') || 'Short description for listing...'}
          />
        </div>

        {/* Content Editor Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.contentEditorMode') || 'Content Editor Mode'}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setContentEditorMode('plain')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                contentEditorMode === 'plain'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('admin.plainText') || 'Plain Text'}
            </button>
            <button
              type="button"
              onClick={() => setContentEditorMode('rich')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                contentEditorMode === 'rich'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('admin.richText') || 'Rich Text'}
            </button>
            <button
              type="button"
              onClick={() => setContentEditorMode('markdown')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                contentEditorMode === 'markdown'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('admin.markdown') || 'Markdown'}
            </button>
          </div>
        </div>

        {/* Content TR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.content') || 'Content'} (TR) *
          </label>
          {contentEditorMode === 'plain' && (
            <textarea
              value={formData.content_tr}
              onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })}
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          )}
          {contentEditorMode === 'rich' && (
            <RichTextEditor
              value={formData.content_tr}
              onChange={(value) => setFormData({ ...formData, content_tr: value })}
              placeholder={t('admin.contentPlaceholder') || 'Enter content...'}
            />
          )}
          {contentEditorMode === 'markdown' && (
            <MarkdownEditor
              value={formData.content_tr}
              onChange={(value) => setFormData({ ...formData, content_tr: value })}
              placeholder={t('admin.contentPlaceholder') || 'Enter markdown content...'}
            />
          )}
        </div>

        {/* Content EN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.content') || 'Content'} (EN) *
          </label>
          {contentEditorMode === 'plain' && (
            <textarea
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          )}
          {contentEditorMode === 'rich' && (
            <RichTextEditor
              value={formData.content_en}
              onChange={(value) => setFormData({ ...formData, content_en: value })}
              placeholder={t('admin.contentPlaceholder') || 'Enter content...'}
            />
          )}
          {contentEditorMode === 'markdown' && (
            <MarkdownEditor
              value={formData.content_en}
              onChange={(value) => setFormData({ ...formData, content_en: value })}
              placeholder={t('admin.contentPlaceholder') || 'Enter markdown content...'}
            />
          )}
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.featuredImage') || 'Featured Image'}
          </label>
          <ImageUploader
            currentImageUrl={formData.featured_image_url}
            onImageUploaded={(url) => setFormData({ ...formData, featured_image_url: url })}
            bucket={STORAGE_BUCKETS.PROJECT_IMAGES}
            folder="blog"
            maxSizeMB={5}
          />
        </div>

        {/* Download URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.downloadUrl') || 'Download URL'}
          </label>
          <input
            type="url"
            value={formData.download_url}
            onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="https://example.com/file.pdf"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('admin.downloadUrlHint') || 'URL for downloadable file (PDF, ZIP, etc.)'}
          </p>
        </div>

        {/* Download Label TR */}
        {formData.download_url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.downloadLabel') || 'Download Button Label'} (TR)
            </label>
            <input
              type="text"
              value={formData.download_label_tr}
              onChange={(e) => setFormData({ ...formData, download_label_tr: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('admin.downloadLabelPlaceholder') || 'e.g., Download PDF, İndir, etc.'}
            />
          </div>
        )}

        {/* Download Label EN */}
        {formData.download_url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.downloadLabel') || 'Download Button Label'} (EN)
            </label>
            <input
              type="text"
              value={formData.download_label_en}
              onChange={(e) => setFormData({ ...formData, download_label_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('admin.downloadLabelPlaceholder') || 'e.g., Download PDF, Download, etc.'}
            />
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.category') || 'Category'}
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as BlogCategory })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`blog.categories.${cat}`) || cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.tags') || 'Tags'} (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="react, typescript, tutorial"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            {t('admin.published') || 'Published'}
          </label>
          {formData.published && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.publishedAt') || 'Published At'}
              </label>
              <input
                type="datetime-local"
                value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('common.save')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

