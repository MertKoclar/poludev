import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import type { SocialLinkItem } from '../../types';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import { Trash2, Edit, GripVertical } from 'lucide-react';

export const SocialLinksManagement: React.FC = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<SocialLinkItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draggedLink, setDraggedLink] = useState<string | null>(null);
  const [dragOverLink, setDragOverLink] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      setLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching social links:', err);
      logError(err, 'fetchLinks');
      error(getErrorMessage(err, t('admin.errorFetchingSocialLinks') || 'Failed to fetch social links'));
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (linkId: string) => {
    setDraggedLink(linkId);
  };

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault();
    if (draggedLink && draggedLink !== linkId) {
      setDragOverLink(linkId);
    }
  };

  const handleDragLeave = () => {
    setDragOverLink(null);
  };

  const handleDrop = async (e: React.DragEvent, targetLinkId: string) => {
    e.preventDefault();
    setDragOverLink(null);

    if (!draggedLink || draggedLink === targetLinkId) {
      setDraggedLink(null);
      return;
    }

    const draggedIndex = links.findIndex(l => l.id === draggedLink);
    const targetIndex = links.findIndex(l => l.id === targetLinkId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedLink(null);
      return;
    }

    // Reorder links array
    const newLinks = [...links];
    const [draggedItem] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedItem);

    // Update order_index for all affected links
    const updates = newLinks.map((link, index) => ({
      id: link.id,
      order_index: index,
    }));

    try {
      // Update all links in batch
      for (const update of updates) {
        await supabase
          .from('social_links')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      setLinks(newLinks);
      success(t('admin.socialLinksReordered') || 'Social links reordered successfully');
    } catch (err: any) {
      console.error('Error reordering social links:', err);
      error(err.message || 'Failed to reorder social links');
      fetchLinks(); // Revert on error
    } finally {
      setDraggedLink(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm') || 'Are you sure you want to delete this link?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      success(t('admin.socialLinkDeleted') || 'Social link deleted successfully');
      fetchLinks();
    } catch (err: any) {
      logError(err, 'handleDelete');
      error(getErrorMessage(err, t('admin.errorDeletingSocialLink') || 'Failed to delete social link'));
    }
  };

  const handleToggleActive = async (link: SocialLinkItem) => {
    try {
      const { error: updateError } = await supabase
        .from('social_links')
        .update({ is_active: !link.is_active })
        .eq('id', link.id);

      if (updateError) throw updateError;
      success(t('admin.socialLinkUpdated') || 'Social link updated successfully');
      fetchLinks();
    } catch (err: any) {
      logError(err, 'handleToggleActive');
      error(getErrorMessage(err, t('admin.errorUpdatingSocialLink') || 'Failed to update social link'));
    }
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
            {t('admin.socialLinksManagement') || 'Social Links Management'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.manageSocialLinks') || 'Manage social media links displayed in footer'}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm sm:text-base"
        >
          {t('admin.addSocialLink') || 'Add Social Link'}
        </button>
      </div>

      {showForm && (
        <SocialLinkForm
          link={editingLink}
          onClose={() => {
            setShowForm(false);
            setEditingLink(null);
          }}
          onSuccess={() => {
            fetchLinks();
            setShowForm(false);
            setEditingLink(null);
          }}
        />
      )}

      {!loading && links.length === 0 && (
        <div className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            {t('admin.noSocialLinks') || 'No social links found. Add your first link!'}
          </p>
          <button
            onClick={() => {
              setEditingLink(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('admin.addSocialLink') || 'Add Social Link'}
          </button>
        </div>
      )}

      {!loading && links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              draggable
              onDragStart={() => handleDragStart(link.id)}
              onDragOver={(e) => handleDragOver(e, link.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, link.id)}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-4 transition-all cursor-move ${
                dragOverLink === link.id
                  ? 'border-orange-500 ring-2 ring-orange-500'
                  : draggedLink === link.id
                  ? 'opacity-50 border-gray-300 dark:border-gray-600'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{link.platform}</h3>
                      {link.is_active ? (
                        <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                          {t('admin.active') || 'Active'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          {t('admin.inactive') || 'Inactive'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all">{link.url}</p>
                    {link.icon_name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Icon: {link.icon_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(link)}
                    className={`p-2 rounded transition-colors ${
                      link.is_active
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                    title={link.is_active ? t('admin.deactivate') || 'Deactivate' : t('admin.activate') || 'Activate'}
                  >
                    {link.is_active ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingLink(link);
                      setShowForm(true);
                    }}
                    className="p-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SocialLinkFormProps {
  link: SocialLinkItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({ link, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    platform: link?.platform || '',
    url: link?.url || '',
    icon_name: link?.icon_name || '',
    order_index: link?.order_index ?? 0,
    is_active: link?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const platforms = ['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube', 'mail', 'website'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (link) {
        const { error } = await supabase
          .from('social_links')
          .update(formData)
          .eq('id', link.id);
        if (error) throw error;
      } else {
        // Get max order_index for new link
        const { data: existingLinks } = await supabase
          .from('social_links')
          .select('order_index')
          .order('order_index', { ascending: false })
          .limit(1);

        const maxOrder = existingLinks && existingLinks.length > 0 
          ? existingLinks[0].order_index + 1 
          : 0;

        const { error } = await supabase
          .from('social_links')
          .insert([{ ...formData, order_index: maxOrder }]);
        if (error) throw error;
      }

      showSuccess(t('admin.socialLinkSaved') || 'Social link saved successfully');
      onSuccess();
    } catch (err: any) {
      console.error('Error saving social link:', err);
      logError(err, 'handleSubmit');
      showError(getErrorMessage(err, t('admin.errorSavingSocialLink') || 'Failed to save social link'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={link ? t('admin.editSocialLink') || 'Edit Social Link' : t('admin.addSocialLink') || 'Add Social Link'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.platform') || 'Platform'} *
          </label>
          <select
            value={formData.platform}
            onChange={(e) => {
              const platform = e.target.value;
              setFormData({ 
                ...formData, 
                platform,
                icon_name: formData.icon_name || platform.toLowerCase()
              });
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{t('admin.selectPlatform') || 'Select Platform'}</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.url') || 'URL'} *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
            placeholder="https://github.com/username"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.iconName') || 'Icon Name'} (optional)
          </label>
          <input
            type="text"
            value={formData.icon_name}
            onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
            placeholder="github, linkedin, twitter, etc."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('admin.iconNameHint') || 'Icon name for display (usually same as platform)'}
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            {t('admin.active') || 'Active'}
          </label>
        </div>

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

