import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import type { FooterLink } from '../../types';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import { Trash2, Edit, GripVertical } from 'lucide-react';

export const FooterManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'tr' | 'en';
  const { success, error } = useToast();
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
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
        .from('footer_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      setLinks(data || []);
    } catch (err: any) {
      console.error('Error fetching footer links:', err);
      logError(err, 'fetchLinks');
      error(getErrorMessage(err, t('admin.errorFetchingFooterLinks') || 'Failed to fetch footer links'));
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
          .from('footer_links')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      setLinks(newLinks);
      success(t('admin.footerLinksReordered') || 'Footer links reordered successfully');
    } catch (err: any) {
      console.error('Error reordering footer links:', err);
      error(err.message || 'Failed to reorder footer links');
      fetchLinks(); // Revert on error
    } finally {
      setDraggedLink(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm') || 'Are you sure you want to delete this link?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('footer_links')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      success(t('admin.footerLinkDeleted') || 'Footer link deleted successfully');
      fetchLinks();
    } catch (err: any) {
      logError(err, 'handleDelete');
      error(getErrorMessage(err, t('admin.errorDeletingFooterLink') || 'Failed to delete footer link'));
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
            {t('admin.footerManagement') || 'Footer Management'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.manageFooterLinks') || 'Manage footer navigation links'}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm sm:text-base"
        >
          {t('admin.addFooterLink') || 'Add Footer Link'}
        </button>
      </div>

      {showForm && (
        <FooterLinkForm
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
            {t('admin.noFooterLinks') || 'No footer links found. Add your first link!'}
          </p>
          <button
            onClick={() => {
              setEditingLink(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            {t('admin.addFooterLink') || 'Add Footer Link'}
          </button>
        </div>
      )}

      {!loading && links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => {
            const label = lang === 'tr' ? link.label_tr : link.label_en;
            return (
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
                        <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
                        {link.is_external && (
                          <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                            {t('admin.external') || 'External'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{link.path}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          TR: {link.label_tr}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          EN: {link.label_en}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
            );
          })}
        </div>
      )}
    </div>
  );
};

interface FooterLinkFormProps {
  link: FooterLink | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FooterLinkForm: React.FC<FooterLinkFormProps> = ({ link, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    label_tr: link?.label_tr || '',
    label_en: link?.label_en || '',
    path: link?.path || '',
    order_index: link?.order_index ?? 0,
    is_external: link?.is_external || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (link) {
        const { error } = await supabase
          .from('footer_links')
          .update(formData)
          .eq('id', link.id);
        if (error) throw error;
      } else {
        // Get max order_index for new link
        const { data: existingLinks } = await supabase
          .from('footer_links')
          .select('order_index')
          .order('order_index', { ascending: false })
          .limit(1);

        const maxOrder = existingLinks && existingLinks.length > 0 
          ? existingLinks[0].order_index + 1 
          : 0;

        const { error } = await supabase
          .from('footer_links')
          .insert([{ ...formData, order_index: maxOrder }]);
        if (error) throw error;
      }

      showSuccess(t('admin.footerLinkSaved') || 'Footer link saved successfully');
      onSuccess();
    } catch (err: any) {
      console.error('Error saving footer link:', err);
      logError(err, 'handleSubmit');
      showError(getErrorMessage(err, t('admin.errorSavingFooterLink') || 'Failed to save footer link'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={link ? t('admin.editFooterLink') || 'Edit Footer Link' : t('admin.addFooterLink') || 'Add Footer Link'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.label') || 'Label'} (TR) *
          </label>
          <input
            type="text"
            value={formData.label_tr}
            onChange={(e) => setFormData({ ...formData, label_tr: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.label') || 'Label'} (EN) *
          </label>
          <input
            type="text"
            value={formData.label_en}
            onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.path') || 'Path'} *
          </label>
          <input
            type="text"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            required
            placeholder="/about or https://example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.is_external}
              onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            {t('admin.externalLink') || 'External Link (opens in new tab)'}
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

