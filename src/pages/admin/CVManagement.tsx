import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import { STORAGE_BUCKETS, USER_IDS, USER_NAMES } from '../../config/constants';
import type { User, CVVersion, CVDownload, CVAnalytics, CVFormat } from '../../types';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  History,
  BarChart3,
  File,
  Check,
  X,
  Calendar,
  TrendingUp,
  FileDown,
  Layers,
  AlertCircle,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

type TabType = 'overview' | 'versions' | 'analytics' | 'upload';

interface UserWithCV extends User {
  cv_versions?: CVVersion[];
  active_version?: CVVersion | null;
  analytics?: CVAnalytics;
}

export const CVManagement: React.FC = () => {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();
  const [users, setUsers] = useState<UserWithCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [previewCV, setPreviewCV] = useState<{ user: string; url: string } | null>(null);
  const [uploadingUser, setUploadingUser] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<CVFormat>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [newVersionNotes, setNewVersionNotes] = useState('');

  const cvFormats: { value: CVFormat; label: string; icon: React.ReactNode }[] = [
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-5 h-5" /> },
    { value: 'docx', label: 'DOCX', icon: <File className="w-5 h-5" /> },
    { value: 'html', label: 'HTML', icon: <FileText className="w-5 h-5" /> },
  ];

  const cvTemplates = [
    { value: 'default', label: t('admin.defaultTemplate') || 'Default Template' },
    { value: 'modern', label: t('admin.modernTemplate') || 'Modern Template' },
    { value: 'classic', label: t('admin.classicTemplate') || 'Classic Template' },
    { value: 'creative', label: t('admin.creativeTemplate') || 'Creative Template' },
  ];

  useEffect(() => {
    fetchUsersWithCV();
  }, []);

  const fetchUsersWithCV = async () => {
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .in('id', [USER_IDS.MERT, USER_IDS.MUSTAFA])
        .order('name');

      if (usersError) throw usersError;

      // Fetch CV versions for each user
      const usersWithCV = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: versions, error: versionsError } = await supabase
            .from('cv_versions')
            .select('*')
            .eq('user_id', user.id)
            .order('version', { ascending: false });

          if (versionsError) {
            console.error('Error fetching CV versions:', versionsError);
          }

          const activeVersion = versions?.find((v) => v.is_active) || null;

          // Fetch analytics if there's an active version
          let analytics: CVAnalytics | undefined;
          if (activeVersion) {
            analytics = await fetchCVAnalytics(activeVersion.id);
          }

          return {
            ...user,
            cv_versions: versions || [],
            active_version: activeVersion,
            analytics,
          };
        })
      );

      setUsers(usersWithCV);
    } catch (error: any) {
      console.error('Error fetching users with CV:', error);
      showError(error.message || t('admin.errorFetchingCV') || 'Error fetching CV data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCVAnalytics = async (cvVersionId: string): Promise<CVAnalytics> => {
    try {
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total downloads
      const { count: totalCount } = await supabase
        .from('cv_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('cv_version_id', cvVersionId);

      // Downloads last 7 days
      const { count: weekCount } = await supabase
        .from('cv_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('cv_version_id', cvVersionId)
        .gte('downloaded_at', last7Days.toISOString());

      // Downloads last 30 days
      const { count: monthCount } = await supabase
        .from('cv_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('cv_version_id', cvVersionId)
        .gte('downloaded_at', last30Days.toISOString());

      // Downloads by version
      const { data: versionData } = await supabase
        .from('cv_downloads')
        .select('cv_version_id')
        .eq('cv_version_id', cvVersionId);

      // Downloads by date (last 30 days)
      const { data: dateData } = await supabase
        .from('cv_downloads')
        .select('downloaded_at')
        .eq('cv_version_id', cvVersionId)
        .gte('downloaded_at', last30Days.toISOString())
        .order('downloaded_at', { ascending: true });

      // Process downloads by date
      const downloadsByDateMap = new Map<string, number>();
      dateData?.forEach((download) => {
        const date = new Date(download.downloaded_at).toISOString().split('T')[0];
        downloadsByDateMap.set(date, (downloadsByDateMap.get(date) || 0) + 1);
      });

      const downloadsByDate = Array.from(downloadsByDateMap.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      // Calculate average downloads per day (last 30 days)
      const averageDownloadsPerDay = monthCount && monthCount > 0 ? monthCount / 30 : 0;

      return {
        totalDownloads: totalCount || 0,
        downloadsLast7Days: weekCount || 0,
        downloadsLast30Days: monthCount || 0,
        downloadsByVersion: [{ version: 1, count: totalCount || 0 }],
        downloadsByDate,
        averageDownloadsPerDay: Math.round(averageDownloadsPerDay * 10) / 10,
      };
    } catch (error) {
      console.error('Error fetching CV analytics:', error);
      return {
        totalDownloads: 0,
        downloadsLast7Days: 0,
        downloadsLast30Days: 0,
        downloadsByVersion: [],
        downloadsByDate: [],
        averageDownloadsPerDay: 0,
      };
    }
  };

  const handleFileUpload = async (userId: string, file: File, format: CVFormat, template: string, notes: string) => {
    try {
      setUploadingUser(userId);

      // Get current max version for this user
      const { data: existingVersions } = await supabase
        .from('cv_versions')
        .select('version')
        .eq('user_id', userId)
        .order('version', { ascending: false })
        .limit(1);

      const newVersion = existingVersions && existingVersions.length > 0 
        ? existingVersions[0].version + 1 
        : 1;

      // Deactivate all existing versions
      await supabase
        .from('cv_versions')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop() || format;
      const fileName = `${userId}_v${newVersion}_${Date.now()}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.CV_FILES)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.CV_FILES)
        .getPublicUrl(filePath);

      // Create new CV version record
      const { data: versionData, error: versionError } = await supabase
        .from('cv_versions')
        .insert([
          {
            user_id: userId,
            version: newVersion,
            file_path: filePath,
            file_format: format,
            file_size: file.size,
            template_name: template !== 'default' ? template : null,
            is_active: true,
            notes: notes || null,
          },
        ])
        .select()
        .single();

      if (versionError) throw versionError;

      // Update user's cv_url to point to the new version
      await supabase
        .from('users')
        .update({ cv_url: urlData.publicUrl })
        .eq('id', userId);

      showSuccess(t('admin.cvUploaded') || 'CV uploaded successfully');
      fetchUsersWithCV();
      setUploadingUser(null);
      setNewVersionNotes('');
    } catch (error: any) {
      console.error('Error uploading CV:', error);
      showError(error.message || t('admin.errorUploadingCV') || 'Error uploading CV');
      setUploadingUser(null);
    }
  };

  const handleDownloadCV = async (cvVersion: CVVersion, userName: string) => {
    try {
      // Track download
      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser.user) {
        await supabase.from('cv_downloads').insert([
          {
            cv_version_id: cvVersion.id,
            user_id: cvVersion.user_id,
            // IP address and user agent could be added here if needed
          },
        ]);
      }

      // Get download URL
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.CV_FILES)
        .getPublicUrl(cvVersion.file_path);

      // Open in new tab or trigger download
      window.open(data.publicUrl, '_blank');

      // Refresh analytics
      fetchUsersWithCV();
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      showError(error.message || t('admin.errorDownloadingCV') || 'Error downloading CV');
    }
  };

  const handleSetActiveVersion = async (cvVersion: CVVersion) => {
    try {
      // Deactivate all versions for this user
      await supabase
        .from('cv_versions')
        .update({ is_active: false })
        .eq('user_id', cvVersion.user_id);

      // Activate selected version
      await supabase
        .from('cv_versions')
        .update({ is_active: true })
        .eq('id', cvVersion.id);

      // Update user's cv_url
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.CV_FILES)
        .getPublicUrl(cvVersion.file_path);

      await supabase
        .from('users')
        .update({ cv_url: data.publicUrl })
        .eq('id', cvVersion.user_id);

      showSuccess(t('admin.cvVersionActivated') || 'CV version activated');
      fetchUsersWithCV();
    } catch (error: any) {
      console.error('Error setting active version:', error);
      showError(error.message || t('admin.errorActivatingVersion') || 'Error activating version');
    }
  };

  const handleDeleteVersion = async (cvVersion: CVVersion) => {
    if (!confirm(t('admin.deleteCVVersionConfirm') || 'Are you sure you want to delete this CV version?')) {
      return;
    }

    try {
      // Don't delete if it's the only version
      const { data: versions } = await supabase
        .from('cv_versions')
        .select('id')
        .eq('user_id', cvVersion.user_id);

      if (versions && versions.length <= 1) {
        showError(t('admin.cannotDeleteOnlyVersion') || 'Cannot delete the only CV version');
        return;
      }

      // Delete from storage
      await supabase.storage
        .from(STORAGE_BUCKETS.CV_FILES)
        .remove([cvVersion.file_path]);

      // Delete version record
      await supabase
        .from('cv_versions')
        .delete()
        .eq('id', cvVersion.id);

      // If deleted version was active, set latest version as active
      if (cvVersion.is_active) {
        const { data: latestVersion } = await supabase
          .from('cv_versions')
          .select('*')
          .eq('user_id', cvVersion.user_id)
          .order('version', { ascending: false })
          .limit(1)
          .single();

        if (latestVersion) {
          await handleSetActiveVersion(latestVersion);
        }
      }

      showSuccess(t('admin.cvVersionDeleted') || 'CV version deleted successfully');
      fetchUsersWithCV();
    } catch (error: any) {
      console.error('Error deleting CV version:', error);
      showError(error.message || t('admin.errorDeletingVersion') || 'Error deleting version');
    }
  };

  const getFileSizeString = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getUserAnalytics = (user: UserWithCV): CVAnalytics => {
    return user.analytics || {
      totalDownloads: 0,
      downloadsLast7Days: 0,
      downloadsLast30Days: 0,
      downloadsByVersion: [],
      downloadsByDate: [],
      averageDownloadsPerDay: 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('admin.cvManagement')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('admin.manageCV') || 'Upload, manage and track CV files'}
        </p>
      </div>

      {/* User Selection */}
      {!selectedUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {users.map((user) => {
            const analytics = getUserAnalytics(user);
            const hasCV = user.active_version !== null;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => {
                  setSelectedUser(user.id);
                  setActiveTab('overview');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {hasCV && user.active_version && (
                        <>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            v{user.active_version.version} ({user.active_version.file_format.toUpperCase()})
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.active_version.created_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                      {!hasCV && (
                        <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {t('admin.noCVUploaded') || 'No CV uploaded'}
                        </span>
                      )}
                    </div>
                  </div>
                  {hasCV && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      {t('admin.active') || 'Active'}
                    </span>
                  )}
                </div>

                {hasCV && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('admin.totalDownloads') || 'Total Downloads'}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {analytics.totalDownloads}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('admin.last7Days') || 'Last 7 Days'}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {analytics.downloadsLast7Days}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('admin.versions') || 'Versions'}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {user.cv_versions?.length || 0}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                    {t('admin.manageCV') || 'Manage CV'}
                    <ExternalLink className="w-4 h-4" />
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <CVUserDetail
          user={selectedUserData!}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBack={() => setSelectedUser(null)}
          onPreview={(url) => setPreviewCV({ user: selectedUserData!.name, url })}
          onDownload={handleDownloadCV}
          onSetActive={handleSetActiveVersion}
          onDelete={handleDeleteVersion}
          onUpload={handleFileUpload}
          uploading={uploadingUser === selectedUser}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          newVersionNotes={newVersionNotes}
          onNotesChange={setNewVersionNotes}
          formats={cvFormats}
          templates={cvTemplates}
          onRefresh={fetchUsersWithCV}
          t={t}
        />
      )}

      {/* CV Preview Modal */}
      {previewCV && (
        <Modal
          isOpen={!!previewCV}
          onClose={() => setPreviewCV(null)}
          title={`${t('admin.cvPreview') || 'CV Preview'} - ${previewCV.user}`}
          size="full"
        >
          <div className="h-[calc(100vh-8rem)]">
            <iframe
              src={previewCV.url}
              className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg"
              title="CV Preview"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

interface CVUserDetailProps {
  user: UserWithCV;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onBack: () => void;
  onPreview: (url: string) => void;
  onDownload: (version: CVVersion, userName: string) => void;
  onSetActive: (version: CVVersion) => void;
  onDelete: (version: CVVersion) => void;
  onUpload: (userId: string, file: File, format: CVFormat, template: string, notes: string) => void;
  uploading: boolean;
  selectedFormat: CVFormat;
  onFormatChange: (format: CVFormat) => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  newVersionNotes: string;
  onNotesChange: (notes: string) => void;
  formats: Array<{ value: CVFormat; label: string; icon: React.ReactNode }>;
  templates: Array<{ value: string; label: string }>;
  onRefresh: () => void;
  t: (key: string) => string;
}

const CVUserDetail: React.FC<CVUserDetailProps> = ({
  user,
  activeTab,
  onTabChange,
  onBack,
  onPreview,
  onDownload,
  onSetActive,
  onDelete,
  onUpload,
  uploading,
  selectedFormat,
  onFormatChange,
  selectedTemplate,
  onTemplateChange,
  newVersionNotes,
  onNotesChange,
  formats,
  templates,
  onRefresh,
  t,
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const analytics = getUserAnalytics(user);

  const tabs = [
    { id: 'overview' as TabType, label: t('admin.overview') || 'Overview', icon: FileText },
    { id: 'versions' as TabType, label: t('admin.versions') || 'Versions', icon: History },
    { id: 'analytics' as TabType, label: t('admin.analytics') || 'Analytics', icon: BarChart3 },
    { id: 'upload' as TabType, label: t('admin.upload') || 'Upload', icon: Upload },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file format
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt === 'pdf') {
        onFormatChange('pdf');
      } else if (fileExt === 'docx' || fileExt === 'doc') {
        onFormatChange('docx');
      } else if (fileExt === 'html' || fileExt === 'htm') {
        onFormatChange('html');
      }
      setUploadFile(file);
    }
  };

  const handleSubmitUpload = () => {
    if (!uploadFile) {
      return;
    }
    onUpload(user.id, uploadFile, selectedFormat, selectedTemplate, newVersionNotes);
    setUploadFile(null);
    onNotesChange('');
  };

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.CV_FILES)
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
          {user.active_version && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('admin.activeVersion') || 'Active Version'}: v{user.active_version.version} ({user.active_version.file_format.toUpperCase()})
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <OverviewTab
            key="overview"
            user={user}
            analytics={analytics}
            onPreview={onPreview}
            onDownload={onDownload}
            getPublicUrl={getPublicUrl}
            t={t}
          />
        )}

        {activeTab === 'versions' && (
          <VersionsTab
            key="versions"
            user={user}
            versions={user.cv_versions || []}
            onPreview={onPreview}
            onDownload={onDownload}
            onSetActive={onSetActive}
            onDelete={onDelete}
            getPublicUrl={getPublicUrl}
            getFileSizeString={(bytes: number) => {
              if (bytes < 1024) return `${bytes} B`;
              if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
              return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
            }}
            t={t}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            key="analytics"
            user={user}
            analytics={analytics}
            t={t}
          />
        )}

        {activeTab === 'upload' && (
          <UploadTab
            key="upload"
            user={user}
            uploading={uploading}
            uploadFile={uploadFile}
            onFileSelect={handleFileSelect}
            onSubmit={handleSubmitUpload}
            selectedFormat={selectedFormat}
            onFormatChange={onFormatChange}
            selectedTemplate={selectedTemplate}
            onTemplateChange={onTemplateChange}
            newVersionNotes={newVersionNotes}
            onNotesChange={onNotesChange}
            formats={formats}
            templates={templates}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Overview Tab Component
interface OverviewTabProps {
  user: UserWithCV;
  analytics: CVAnalytics;
  onPreview: (url: string) => void;
  onDownload: (version: CVVersion, userName: string) => void;
  getPublicUrl: (path: string) => string;
  t: (key: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ user, analytics, onPreview, onDownload, getPublicUrl, t }) => {
  if (!user.active_version) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
          {t('admin.noCVUploaded') || 'No CV uploaded for this user'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {t('admin.uploadFirstCV') || 'Upload a CV to get started'}
        </p>
      </div>
    );
  }

  const cvUrl = getPublicUrl(user.active_version.file_path);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Active CV Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('admin.activeCV') || 'Active CV'}
              </h3>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                {t('admin.active') || 'Active'}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium uppercase">
                {user.active_version.file_format}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('admin.version') || 'Version'}: v{user.active_version.version}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('admin.uploaded') || 'Uploaded'}: {new Date(user.active_version.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {user.active_version.file_size > 0 && (
                <p className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  {t('admin.fileSize') || 'File Size'}: {(() => {
                    const bytes = user.active_version.file_size;
                    if (bytes < 1024) return `${bytes} B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
                    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                  })()}
                </p>
              )}
              {user.active_version.template_name && (
                <p className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  {t('admin.template') || 'Template'}: {user.active_version.template_name}
                </p>
              )}
              {user.active_version.notes && (
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('admin.notes') || 'Notes'}: {user.active_version.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onPreview(cvUrl)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {t('admin.preview') || 'Preview'}
          </button>
          <button
            onClick={() => onDownload(user.active_version!, user.name)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('admin.download') || 'Download'}
          </button>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t('admin.openInNewTab') || 'Open in New Tab'}
          </a>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Download className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{analytics.totalDownloads}</h3>
          <p className="text-blue-100 text-sm">{t('admin.totalDownloads') || 'Total Downloads'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{analytics.downloadsLast7Days}</h3>
          <p className="text-green-100 text-sm">{t('admin.last7Days') || 'Last 7 Days'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{analytics.downloadsLast30Days}</h3>
          <p className="text-purple-100 text-sm">{t('admin.last30Days') || 'Last 30 Days'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{analytics.averageDownloadsPerDay}</h3>
          <p className="text-orange-100 text-sm">{t('admin.avgPerDay') || 'Avg. per Day'}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Versions Tab Component
interface VersionsTabProps {
  user: UserWithCV;
  versions: CVVersion[];
  onPreview: (url: string) => void;
  onDownload: (version: CVVersion, userName: string) => void;
  onSetActive: (version: CVVersion) => void;
  onDelete: (version: CVVersion) => void;
  getPublicUrl: (path: string) => string;
  getFileSizeString: (bytes: number) => string;
  t: (key: string) => string;
}

const VersionsTab: React.FC<VersionsTabProps> = ({
  user,
  versions,
  onPreview,
  onDownload,
  onSetActive,
  onDelete,
  getPublicUrl,
  getFileSizeString,
  t,
}) => {
  if (versions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('admin.noCVVersions') || 'No CV versions found'}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {versions.map((version, index) => {
        const cvUrl = getPublicUrl(version.file_path);
        return (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('admin.version') || 'Version'} {version.version}
                  </h3>
                  {version.is_active && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                      {t('admin.active') || 'Active'}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium uppercase">
                    {version.file_format}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(version.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    {getFileSizeString(version.file_size)}
                  </p>
                  {version.template_name && (
                    <p className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      {t('admin.template') || 'Template'}: {version.template_name}
                    </p>
                  )}
                  {version.notes && (
                    <p className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {version.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!version.is_active && (
                <button
                  onClick={() => onSetActive(version)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Check className="w-4 h-4" />
                  {t('admin.setActive') || 'Set Active'}
                </button>
              )}
              <button
                onClick={() => onPreview(cvUrl)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                {t('admin.preview') || 'Preview'}
              </button>
              <button
                onClick={() => onDownload(version, user.name)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                {t('admin.download') || 'Download'}
              </button>
              {versions.length > 1 && (
                <button
                  onClick={() => onDelete(version)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('common.delete') || 'Delete'}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Analytics Tab Component
interface AnalyticsTabProps {
  user: UserWithCV;
  analytics: CVAnalytics;
  t: (key: string) => string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analytics, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Download Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Download className="w-6 h-6 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analytics.totalDownloads}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.totalDownloads') || 'Total Downloads'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analytics.downloadsLast7Days}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.last7Days') || 'Last 7 Days'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analytics.downloadsLast30Days}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.last30Days') || 'Last 30 Days'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analytics.averageDownloadsPerDay}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.avgPerDay') || 'Avg. per Day'}
          </p>
        </div>
      </div>

      {/* Downloads by Date Chart */}
      {analytics.downloadsByDate.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.downloadsOverTime') || 'Downloads Over Time (Last 30 Days)'}
          </h3>
          <div className="space-y-2">
            {analytics.downloadsByDate.slice(-10).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-xs text-gray-600 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / Math.max(...analytics.downloadsByDate.map(d => d.count))) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                  >
                    {item.count > 0 && (
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {analytics.downloadsByDate.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {t('admin.noDownloadData') || 'No download data available yet'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Upload Tab Component
interface UploadTabProps {
  user: UserWithCV;
  uploading: boolean;
  uploadFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  selectedFormat: CVFormat;
  onFormatChange: (format: CVFormat) => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  newVersionNotes: string;
  onNotesChange: (notes: string) => void;
  formats: Array<{ value: CVFormat; label: string; icon: React.ReactNode }>;
  templates: Array<{ value: string; label: string }>;
  t: (key: string) => string;
}

const UploadTab: React.FC<UploadTabProps> = ({
  user,
  uploading,
  uploadFile,
  onFileSelect,
  onSubmit,
  selectedFormat,
  onFormatChange,
  selectedTemplate,
  onTemplateChange,
  newVersionNotes,
  onNotesChange,
  formats,
  templates,
  t,
}) => {
  const nextVersion = (user.cv_versions?.length || 0) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {t('admin.uploadNewVersion') || 'Upload New CV Version'} - {t('admin.version')} {nextVersion}
        </h3>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.selectCVFile') || 'Select CV File'} *
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              onChange={onFileSelect}
              accept=".pdf,.docx,.doc,.html,.txt"
              disabled={uploading}
              className="hidden"
              id="cv-file-input"
            />
            <label
              htmlFor="cv-file-input"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploadFile ? (
                <>
                  <FileText className="w-12 h-12 text-green-600 mb-2" />
                  <p className="text-gray-900 dark:text-white font-medium">{uploadFile.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {(() => {
                      const bytes = uploadFile.size;
                      if (bytes < 1024) return `${bytes} B`;
                      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
                      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                    })()}
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-900 dark:text-white font-medium mb-1">
                    {t('admin.clickToUpload') || 'Click to upload CV'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    PDF, DOCX, HTML supported (Max 10MB)
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.cvFormat') || 'CV Format'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((format) => (
              <button
                key={format.value}
                onClick={() => onFormatChange(format.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                  ${selectedFormat === format.value
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                `}
              >
                <div className={`${selectedFormat === format.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  {format.icon}
                </div>
                <span className={`text-sm font-medium ${selectedFormat === format.value ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  {format.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.cvTemplate') || 'CV Template'} ({t('admin.optional') || 'Optional'})
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {templates.map((template) => (
              <option key={template.value} value={template.value}>
                {template.label}
              </option>
            ))}
          </select>
        </div>

        {/* Version Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.versionNotes') || 'Version Notes'} ({t('admin.optional') || 'Optional'})
          </label>
          <textarea
            value={newVersionNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            placeholder={t('admin.versionNotesPlaceholder') || 'Add notes about this version...'}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={onSubmit}
          disabled={!uploadFile || uploading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t('common.loading') || 'Uploading...'}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {t('admin.uploadCV') || 'Upload CV'}
            </>
          )}
        </button>

        {user.cv_versions && user.cv_versions.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {t('admin.uploadWillCreateNewVersion') || 'Uploading will create a new version and set it as active. Previous versions will be preserved.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Helper function to get user analytics
const getUserAnalytics = (user: UserWithCV): CVAnalytics => {
  return user.analytics || {
    totalDownloads: 0,
    downloadsLast7Days: 0,
    downloadsLast30Days: 0,
    downloadsByVersion: [],
    downloadsByDate: [],
    averageDownloadsPerDay: 0,
  };
};
