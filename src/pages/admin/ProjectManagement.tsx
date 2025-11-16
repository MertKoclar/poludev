import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import type { Project, ProjectCategory, ProjectStatus } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { STORAGE_BUCKETS } from '../../config/constants';
import { Trash2, Edit, Eye, CheckSquare, Square, ExternalLink } from 'lucide-react';

export const ProjectManagement: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm') || 'Are you sure you want to delete this project?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      success(t('admin.projectDeleted') || 'Project deleted successfully');
      fetchProjects();
      setSelectedProjects(new Set());
    } catch (err: any) {
      console.error('Error deleting project:', err);
      error(err.message || 'Failed to delete project');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;
    if (!confirm(t('admin.bulkDeleteConfirm') || `Are you sure you want to delete ${selectedProjects.size} projects?`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .in('id', Array.from(selectedProjects));

      if (deleteError) throw deleteError;
      success(t('admin.projectsDeleted') || `${selectedProjects.size} projects deleted successfully`);
      fetchProjects();
      setSelectedProjects(new Set());
    } catch (err: any) {
      console.error('Error deleting projects:', err);
      error(err.message || 'Failed to delete projects');
    }
  };

  const toggleSelectProject = (id: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)));
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
            {t('admin.projectManagement')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('admin.manageProjects') || 'Manage your projects'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {selectedProjects.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.deleteSelected')}</span>
              <span className="sm:hidden">{t('common.delete')}</span>
              <span>({selectedProjects.size})</span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm sm:text-base"
          >
            {t('admin.addProject')}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {projects.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
          >
            {selectedProjects.size === projects.length ? (
              <CheckSquare className="w-5 h-5 text-orange-600" />
            ) : (
              <Square className="w-5 h-5" />
            )}
            <span>{t('admin.selectAll')}</span>
          </button>
          {selectedProjects.size > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400 px-2 py-1 bg-orange-50 dark:bg-orange-600/20 rounded">
              {selectedProjects.size} {t('admin.selected') || 'selected'}
            </span>
          )}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            fetchProjects();
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('admin.noProjects') || 'No projects found. Add your first project!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                selectedProjects.has(project.id) 
                  ? 'border-orange-600 ring-2 ring-orange-600' 
                  : 'border-transparent'
              }`}
            >
              {/* Project Image */}
              {project.image_url && (
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title_tr}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={() => toggleSelectProject(project.id)}
                      className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg backdrop-blur-sm"
                    >
                      {selectedProjects.has(project.id) ? (
                        <CheckSquare className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  {project.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                      ⭐ {t('projects.featured')}
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title_tr}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {project.description_tr}
                </p>

                {/* Category & Status */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.category && (
                    <span className="px-2 py-1 bg-amber-600 dark:bg-amber-600/30 text-amber-600 dark:text-amber-600 rounded text-xs font-medium">
                      {t(`projects.category.${project.category}`)}
                    </span>
                  )}
                  {project.status && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      project.status === 'completed' ? 'bg-orange-600 dark:bg-orange-600/30 text-orange-600 dark:text-orange-600' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {t(`projects.status.${project.status}`)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-600 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => setPreviewProject(project)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    {t('common.view')}
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('admin.preview') || 'Preview'}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewProject && (
        <Modal
          isOpen={!!previewProject}
          onClose={() => setPreviewProject(null)}
          title={previewProject.title_tr}
          size="lg"
        >
          <div className="space-y-4">
            {previewProject.image_url && (
              <img
                src={previewProject.image_url}
                alt={previewProject.title_tr}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('admin.projectDescription')} (TR)
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{previewProject.description_tr}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('admin.projectDescription')} (EN)
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{previewProject.description_en}</p>
            </div>
            {previewProject.tags && previewProject.tags.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {t('admin.projectTags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {previewProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-600 dark:bg-orange-600/30 text-orange-600 dark:text-orange-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {previewProject.live_url && (
                <a
                  href={previewProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {t('projects.viewLive')}
                </a>
              )}
              {previewProject.github_url && (
                <a
                  href={previewProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {t('projects.viewCode')}
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface ProjectFormProps {
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    title_tr: project?.title_tr || '',
    title_en: project?.title_en || '',
    description_tr: project?.description_tr || '',
    description_en: project?.description_en || '',
    tags: project?.tags.join(',') || '',
    image_url: project?.image_url || '',
    live_url: project?.live_url || '',
    github_url: project?.github_url || '',
    category: (project?.category || 'web') as ProjectCategory,
    status: (project?.status || 'active') as ProjectStatus,
    featured: project?.featured || false,
    star_count: project?.star_count || 0,
    fork_count: project?.fork_count || 0,
    view_count: project?.view_count || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      if (project) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
      }

      showSuccess(t('admin.projectSaved') || 'Project saved successfully');
      onSuccess();
    } catch (err: any) {
      console.error('Error saving project:', err);
      showError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={project ? t('admin.editProject') : t('admin.addProject')}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectTitle')} (TR)
            </label>
            <input
              type="text"
              value={formData.title_tr}
              onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectTitle')} (EN)
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectDescription')} (TR)
            </label>
            <textarea
              value={formData.description_tr}
              onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectDescription')} (EN)
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectTags')} (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectImage')}
            </label>
            <ImageUploader
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              bucket={STORAGE_BUCKETS.PROJECT_IMAGES}
              folder="projects"
              maxSizeMB={5}
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectCategory')}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="web">{t('projects.category.web')}</option>
              <option value="mobile">{t('projects.category.mobile')}</option>
              <option value="desktop">{t('projects.category.desktop')}</option>
              <option value="api">{t('projects.category.api')}</option>
              <option value="other">{t('projects.category.other')}</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectStatus')}
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="active">{t('projects.status.active')}</option>
              <option value="completed">{t('projects.status.completed')}</option>
              <option value="in-development">{t('projects.status.inDevelopment')}</option>
              <option value="on-hold">{t('projects.status.onHold')}</option>
            </select>
          </div>

          {/* Featured & Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                {t('admin.projectFeatured')}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.projectStarCount')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.star_count}
                onChange={(e) => setFormData({ ...formData, star_count: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.projectForkCount')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.fork_count}
                onChange={(e) => setFormData({ ...formData, fork_count: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('admin.projectViewCount')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.view_count}
                onChange={(e) => setFormData({ ...formData, view_count: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectLiveUrl')}
            </label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.projectGithubUrl')}
            </label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50"
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

