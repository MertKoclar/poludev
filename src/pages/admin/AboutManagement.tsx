import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../config/supabaseClient';
import { USER_IDS, STORAGE_BUCKETS } from '../../config/constants';
import type { AboutUs, SocialLink, Education, Experience, Certification, Testimonial } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  X, 
  GripVertical, 
  Trash2, 
  Edit2, 
  GraduationCap, 
  Briefcase, 
  Award, 
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Building,
  ExternalLink,
  Star,
  Save,
} from 'lucide-react';

type TabType = 'general' | 'education' | 'experience' | 'certifications' | 'testimonials';

export const AboutManagement: React.FC = () => {
  const { t } = useTranslation();
  const [mertData, setMertData] = useState<AboutUs | null>(null);
  const [mustafaData, setMustafaData] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<'mert' | 'mustafa' | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us')
        .select('*');

      if (error) throw error;

      const mert = data?.find((item) => item.user_id === USER_IDS.MERT);
      const mustafa = data?.find((item) => item.user_id === USER_IDS.MUSTAFA);
      setMertData(mert || null);
      setMustafaData(mustafa || null);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('admin.aboutManagement')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('admin.manageAbout') || 'Manage about us information'}
        </p>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4 mb-4">
            {mertData?.profile_image_url ? (
              <img
                src={mertData.profile_image_url}
                alt="Mert"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-2 border-blue-500">
                M
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {t('admin.mert')}
              </h2>
              {mertData && (
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {mertData.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{mertData.contact_email}</span>
                    </div>
                  )}
                  {mertData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{mertData.location}</span>
                    </div>
                  )}
                  {mertData.skills && mertData.skills.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="text-xs text-gray-500">{mertData.skills.length} {t('admin.skills')}</span>
                      {mertData.education && mertData.education.length > 0 && (
                        <span className="text-xs text-gray-500">• {mertData.education.length} {t('about.education')}</span>
                      )}
                      {mertData.experience && mertData.experience.length > 0 && (
                        <span className="text-xs text-gray-500">• {mertData.experience.length} {t('about.experience')}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {mertData && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              {mertData.bio_tr || mertData.bio_en}
            </p>
          )}
          <button
            onClick={() => {
              setEditingUser('mert');
              setActiveTab('general');
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {t('common.edit')}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-4 mb-4">
            {mustafaData?.profile_image_url ? (
              <img
                src={mustafaData.profile_image_url}
                alt="Mustafa"
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl border-2 border-green-500">
                M
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {t('admin.mustafa')}
              </h2>
              {mustafaData && (
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {mustafaData.contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{mustafaData.contact_email}</span>
                    </div>
                  )}
                  {mustafaData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{mustafaData.location}</span>
                    </div>
                  )}
                  {mustafaData.skills && mustafaData.skills.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="text-xs text-gray-500">{mustafaData.skills.length} {t('admin.skills')}</span>
                      {mustafaData.education && mustafaData.education.length > 0 && (
                        <span className="text-xs text-gray-500">• {mustafaData.education.length} {t('about.education')}</span>
                      )}
                      {mustafaData.experience && mustafaData.experience.length > 0 && (
                        <span className="text-xs text-gray-500">• {mustafaData.experience.length} {t('about.experience')}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {mustafaData && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              {mustafaData.bio_tr || mustafaData.bio_en}
            </p>
          )}
          <button
            onClick={() => {
              setEditingUser('mustafa');
              setActiveTab('general');
            }}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {t('common.edit')}
          </button>
        </motion.div>
      </div>

      {editingUser && (
        <AboutForm
          user={editingUser}
          data={editingUser === 'mert' ? mertData : mustafaData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => {
            setEditingUser(null);
            setActiveTab('general');
          }}
          onSuccess={() => {
            fetchAboutData();
          }}
        />
      )}
    </div>
  );
};

interface AboutFormProps {
  user: 'mert' | 'mustafa';
  data: AboutUs | null;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onClose: () => void;
  onSuccess: () => void;
}

const AboutForm: React.FC<AboutFormProps> = ({ user, data, activeTab, onTabChange, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState({
    bio_tr: data?.bio_tr || '',
    bio_en: data?.bio_en || '',
    skills: data?.skills || [],
    profile_image_url: data?.profile_image_url || '',
    social_links: (data?.social_links || []) as SocialLink[],
    education: (data?.education || []) as Education[],
    experience: (data?.experience || []) as Experience[],
    certifications: (data?.certifications || []) as Certification[],
    testimonials: (data?.testimonials || []) as Testimonial[],
    contact_email: data?.contact_email || '',
    contact_phone: data?.contact_phone || '',
    location: data?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });
  const [editingItem, setEditingItem] = useState<{
    type: 'education' | 'experience' | 'certification' | 'testimonial';
    index: number;
  } | null>(null);

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.platform.trim() && newSocialLink.url.trim()) {
      setFormData({
        ...formData,
        social_links: [...formData.social_links, { ...newSocialLink }],
      });
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormData({
      ...formData,
      social_links: formData.social_links.filter((_: SocialLink, i: number) => i !== index),
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const aboutData = {
        user_id: user === 'mert' ? USER_IDS.MERT : USER_IDS.MUSTAFA,
        bio_tr: formData.bio_tr,
        bio_en: formData.bio_en,
        skills: formData.skills,
        profile_image_url: formData.profile_image_url || null,
        social_links: formData.social_links.length > 0 ? formData.social_links : null,
        education: formData.education.length > 0 ? formData.education : null,
        experience: formData.experience.length > 0 ? formData.experience : null,
        certifications: formData.certifications.length > 0 ? formData.certifications : null,
        testimonials: formData.testimonials.length > 0 ? formData.testimonials : null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        location: formData.location || null,
      };

      if (data) {
        const { error: updateError } = await supabase
          .from('about_us')
          .update(aboutData)
          .eq('user_id', aboutData.user_id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('about_us')
          .insert([aboutData]);
        if (insertError) throw insertError;
      }

      showSuccess(t('admin.changesSaved') || 'Changes saved successfully');
      onSuccess();
    } catch (err: any) {
      console.error('Error saving about data:', err);
      showError(err.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general' as TabType, label: t('admin.general') || 'General', icon: User },
    { id: 'education' as TabType, label: t('about.education') || 'Education', icon: GraduationCap },
    { id: 'experience' as TabType, label: t('about.experience') || 'Experience', icon: Briefcase },
    { id: 'certifications' as TabType, label: t('about.certifications.title') || 'Certifications', icon: Award },
    { id: 'testimonials' as TabType, label: t('about.testimonials.title') || 'Testimonials', icon: MessageSquare },
  ];

  const socialPlatforms = ['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube', 'website', 'email'];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${t('admin.aboutManagement')} - ${user === 'mert' ? t('admin.mert') : t('admin.mustafa')}`}
      size="full"
    >
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto pb-2">
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
                {tab.id === 'education' && formData.education.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {formData.education.length}
                  </span>
                )}
                {tab.id === 'experience' && formData.experience.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {formData.experience.length}
                  </span>
                )}
                {tab.id === 'certifications' && formData.certifications.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {formData.certifications.length}
                  </span>
                )}
                {tab.id === 'testimonials' && formData.testimonials.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {formData.testimonials.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <GeneralTab
                  key="general"
                  formData={formData}
                  setFormData={setFormData}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  handleAddSkill={handleAddSkill}
                  handleRemoveSkill={handleRemoveSkill}
                  newSocialLink={newSocialLink}
                  setNewSocialLink={setNewSocialLink}
                  handleAddSocialLink={handleAddSocialLink}
                  handleRemoveSocialLink={handleRemoveSocialLink}
                  socialPlatforms={socialPlatforms}
                  t={t}
                />
              )}

              {activeTab === 'education' && (
                <EducationTab
                  key="education"
                  education={formData.education}
                  setEducation={(edu) => setFormData({ ...formData, education: edu })}
                  editingItem={editingItem}
                  setEditingItem={setEditingItem}
                  t={t}
                />
              )}

              {activeTab === 'experience' && (
                <ExperienceTab
                  key="experience"
                  experience={formData.experience}
                  setExperience={(exp: Experience[]) => setFormData({ ...formData, experience: exp })}
                  editingItem={editingItem}
                  setEditingItem={setEditingItem}
                  t={t}
                />
              )}

              {activeTab === 'certifications' && (
                <CertificationsTab
                  key="certifications"
                  certifications={formData.certifications}
                  setCertifications={(certs: Certification[]) => setFormData({ ...formData, certifications: certs })}
                  editingItem={editingItem}
                  setEditingItem={setEditingItem}
                  t={t}
                />
              )}

              {activeTab === 'testimonials' && (
                <TestimonialsTab
                  key="testimonials"
                  testimonials={formData.testimonials}
                  setTestimonials={(test: Testimonial[]) => setFormData({ ...formData, testimonials: test })}
                  editingItem={editingItem}
                  setEditingItem={setEditingItem}
                  t={t}
                />
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? t('common.loading') : t('admin.saveChanges')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// General Tab Component
interface GeneralTabProps {
  formData: any;
  setFormData: (data: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
  newSocialLink: { platform: string; url: string };
  setNewSocialLink: (link: { platform: string; url: string }) => void;
  handleAddSocialLink: () => void;
  handleRemoveSocialLink: (index: number) => void;
  socialPlatforms: string[];
  t: (key: string) => string;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  formData,
  setFormData,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill,
  newSocialLink,
  setNewSocialLink,
  handleAddSocialLink,
  handleRemoveSocialLink,
  socialPlatforms,
  t,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.profilePhoto')}
        </label>
        <ImageUploader
          currentImageUrl={formData.profile_image_url}
          onImageUploaded={(url) => setFormData({ ...formData, profile_image_url: url })}
          bucket={STORAGE_BUCKETS.PROFILE_IMAGES}
          folder="profiles"
          maxSizeMB={2}
        />
      </div>

      {/* Bio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.bioTr')}
          </label>
          <textarea
            value={formData.bio_tr}
            onChange={(e) => setFormData({ ...formData, bio_tr: e.target.value })}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            placeholder={t('admin.bioTr') || 'Turkish biography...'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.bioEn')}
          </label>
          <textarea
            value={formData.bio_en}
            onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            placeholder={t('admin.bioEn') || 'English biography...'}
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.skills')}
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder={t('admin.skillName') || 'Skill name'}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('admin.socialMediaLinks')}
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={newSocialLink.platform}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('admin.platform') || 'Platform'}</option>
              {socialPlatforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="url"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                placeholder={t('admin.url') || 'URL'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {formData.social_links.map((link: SocialLink, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white capitalize">
                    {link.platform}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {link.url}
                  </div>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            {t('about.contactEmail') || 'Contact Email'}
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            {t('about.contactPhone') || 'Contact Phone'}
          </label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            {t('about.location') || 'Location'}
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Education Tab Component
interface EducationTabProps {
  education: Education[];
  setEducation: (edu: Education[]) => void;
  editingItem: { type: 'education' | 'experience' | 'certification' | 'testimonial'; index: number } | null;
  setEditingItem: (item: { type: 'education' | 'experience' | 'certification' | 'testimonial'; index: number } | null) => void;
  t: (key: string) => string;
}

const EducationTab: React.FC<EducationTabProps> = ({ education, setEducation, editingItem, setEditingItem, t }) => {
  const [newEducation, setNewEducation] = useState<Education>({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: null,
    description_tr: '',
    description_en: '',
    location: '',
  });

  const handleAddOrUpdate = () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.field || !newEducation.start_date) {
      return;
    }

    if (editingItem && editingItem.index !== -1) {
      const updated = [...education];
      updated[editingItem.index] = { ...newEducation, id: education[editingItem.index].id };
      setEducation(updated);
      setEditingItem(null);
    } else {
      setEducation([...education, { ...newEducation, id: Date.now().toString() }]);
    }
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: null,
      description_tr: '',
      description_en: '',
      location: '',
    });
  };

  const handleEdit = (index: number) => {
    setNewEducation(education[index]);
    setEditingItem({ type: 'education', index });
  };

  const handleDelete = (index: number) => {
    setEducation(education.filter((_: Education, i: number) => i !== index));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: null,
      description_tr: '',
      description_en: '',
      location: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Add/Edit Form */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {editingItem ? t('common.edit') : t('admin.add')} {t('about.education')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.institution') || 'Institution'} *
            </label>
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.degree') || 'Degree'} *
            </label>
            <input
              type="text"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.field') || 'Field of Study'} *
            </label>
            <input
              type="text"
              value={newEducation.field}
              onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.location') || 'Location'}
            </label>
            <input
              type="text"
              value={newEducation.location || ''}
              onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.startDate') || 'Start Date'} *
            </label>
            <input
              type="date"
              value={newEducation.start_date}
              onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.endDate') || 'End Date'}
            </label>
            <input
              type="date"
              value={newEducation.end_date || ''}
              onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value || null })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.descriptionTr') || 'Description (TR)'}
            </label>
            <textarea
              value={newEducation.description_tr || ''}
              onChange={(e) => setNewEducation({ ...newEducation, description_tr: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.descriptionEn') || 'Description (EN)'}
            </label>
            <textarea
              value={newEducation.description_en || ''}
              onChange={(e) => setNewEducation({ ...newEducation, description_en: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingItem ? t('common.save') : t('admin.add')}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.field}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{edu.institution}</p>
                {edu.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : t('admin.current') || 'Current'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {(edu.description_tr || edu.description_en) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {edu.description_tr || edu.description_en}
              </p>
            )}
          </motion.div>
        ))}
        {education.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('admin.noEducation') || 'No education entries. Add your first one!'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Experience Tab Component (similar structure to Education)
const ExperienceTab: React.FC<any> = ({ experience, setExperience, editingItem, setEditingItem, t }) => {
  const [newExperience, setNewExperience] = useState<Experience>({
    company: '',
    position: '',
    start_date: '',
    end_date: null,
    description_tr: '',
    description_en: '',
    location: '',
    current: false,
  });

  const handleAddOrUpdate = () => {
    if (!newExperience.company || !newExperience.position || !newExperience.start_date) {
      return;
    }

    if (editingItem && editingItem.index !== -1) {
      const updated = [...experience];
      updated[editingItem.index] = { ...newExperience, id: experience[editingItem.index].id };
      setExperience(updated);
      setEditingItem(null);
    } else {
      setExperience([...experience, { ...newExperience, id: Date.now().toString() }]);
    }
    setNewExperience({
      company: '',
      position: '',
      start_date: '',
      end_date: null,
      description_tr: '',
      description_en: '',
      location: '',
      current: false,
    });
  };

  const handleEdit = (index: number) => {
    setNewExperience(experience[index]);
    setEditingItem({ type: 'experience', index });
  };

  const handleDelete = (index: number) => {
    setExperience(experience.filter((_: Experience, i: number) => i !== index));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewExperience({
      company: '',
      position: '',
      start_date: '',
      end_date: null,
      description_tr: '',
      description_en: '',
      location: '',
      current: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Add/Edit Form */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {editingItem ? t('common.edit') : t('admin.add')} {t('about.experience')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.company') || 'Company'} *
            </label>
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.position') || 'Position'} *
            </label>
            <input
              type="text"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.location') || 'Location'}
            </label>
            <input
              type="text"
              value={newExperience.location || ''}
              onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.startDate') || 'Start Date'} *
            </label>
            <input
              type="date"
              value={newExperience.start_date}
              onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.endDate') || 'End Date'}
            </label>
            <input
              type="date"
              value={newExperience.end_date || ''}
              onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value || null })}
              disabled={newExperience.current}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={newExperience.current}
              onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked, end_date: e.target.checked ? null : newExperience.end_date })}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.current') || 'Current Position'}
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.descriptionTr') || 'Description (TR)'}
            </label>
            <textarea
              value={newExperience.description_tr || ''}
              onChange={(e) => setNewExperience({ ...newExperience, description_tr: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.descriptionEn') || 'Description (EN)'}
            </label>
            <textarea
              value={newExperience.description_en || ''}
              onChange={(e) => setNewExperience({ ...newExperience, description_en: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingItem ? t('common.save') : t('admin.add')}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experience.map((exp: Experience, index: number) => (
          <motion.div
            key={exp.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{exp.position}</h4>
                  {exp.current && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                      {t('admin.current') || 'Current'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Building className="w-4 h-4" />
                  {exp.company}
                </p>
                {exp.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : t('admin.current') || 'Current'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {(exp.description_tr || exp.description_en) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {exp.description_tr || exp.description_en}
              </p>
            )}
          </motion.div>
        ))}
        {experience.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('admin.noExperience') || 'No experience entries. Add your first one!'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Certifications Tab Component
const CertificationsTab: React.FC<any> = ({ certifications, setCertifications, editingItem, setEditingItem, t }) => {
  const [newCert, setNewCert] = useState<Certification>({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: null,
    credential_id: '',
    credential_url: '',
  });

  const handleAddOrUpdate = () => {
    if (!newCert.name || !newCert.issuer || !newCert.issue_date) {
      return;
    }

    if (editingItem && editingItem.index !== -1) {
      const updated = [...certifications];
      updated[editingItem.index] = { ...newCert, id: certifications[editingItem.index].id };
      setCertifications(updated);
      setEditingItem(null);
    } else {
      setCertifications([...certifications, { ...newCert, id: Date.now().toString() }]);
    }
    setNewCert({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: null,
      credential_id: '',
      credential_url: '',
    });
  };

  const handleEdit = (index: number) => {
    setNewCert(certifications[index]);
    setEditingItem({ type: 'certification', index });
  };

  const handleDelete = (index: number) => {
    setCertifications(certifications.filter((_: Certification, i: number) => i !== index));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewCert({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: null,
      credential_id: '',
      credential_url: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Add/Edit Form */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {editingItem ? t('common.edit') : t('admin.add')} {t('about.certifications.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.certificationName') || 'Certification Name'} *
            </label>
            <input
              type="text"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.issuer') || 'Issuing Organization'} *
            </label>
            <input
              type="text"
              value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.issueDate') || 'Issue Date'} *
            </label>
            <input
              type="date"
              value={newCert.issue_date}
              onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.expiryDate') || 'Expiry Date'}
            </label>
            <input
              type="date"
              value={newCert.expiry_date || ''}
              onChange={(e) => setNewCert({ ...newCert, expiry_date: e.target.value || null })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.credentialId') || 'Credential ID'}
            </label>
            <input
              type="text"
              value={newCert.credential_id || ''}
              onChange={(e) => setNewCert({ ...newCert, credential_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.credentialUrl') || 'Credential URL'}
            </label>
            <input
              type="url"
              value={newCert.credential_url || ''}
              onChange={(e) => setNewCert({ ...newCert, credential_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingItem ? t('common.save') : t('admin.add')}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map((cert: Certification, index: number) => (
          <motion.div
            key={cert.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                {cert.credential_id && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ID: {cert.credential_id}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(cert.issue_date).toLocaleDateString()}
                  {cert.expiry_date && ` - ${new Date(cert.expiry_date).toLocaleDateString()}`}
                </p>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('admin.viewCredential') || 'View Credential'}
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('admin.noCertifications') || 'No certifications. Add your first one!'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Testimonials Tab Component
const TestimonialsTab: React.FC<any> = ({ testimonials, setTestimonials, editingItem, setEditingItem, t }) => {
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    name: '',
    role: '',
    company: '',
    content_tr: '',
    content_en: '',
    avatar_url: '',
    rating: 5,
  });

  const handleAddOrUpdate = () => {
    if (!newTestimonial.name || !newTestimonial.role || !newTestimonial.content_tr || !newTestimonial.content_en) {
      return;
    }

    if (editingItem && editingItem.index !== -1) {
      const updated = [...testimonials];
      updated[editingItem.index] = { ...newTestimonial, id: testimonials[editingItem.index].id };
      setTestimonials(updated);
      setEditingItem(null);
    } else {
      setTestimonials([...testimonials, { ...newTestimonial, id: Date.now().toString() }]);
    }
    setNewTestimonial({
      name: '',
      role: '',
      company: '',
      content_tr: '',
      content_en: '',
      avatar_url: '',
      rating: 5,
    });
  };

  const handleEdit = (index: number) => {
    setNewTestimonial(testimonials[index]);
    setEditingItem({ type: 'testimonial', index });
  };

  const handleDelete = (index: number) => {
    setTestimonials(testimonials.filter((_: Testimonial, i: number) => i !== index));
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewTestimonial({
      name: '',
      role: '',
      company: '',
      content_tr: '',
      content_en: '',
      avatar_url: '',
      rating: 5,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Add/Edit Form */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {editingItem ? t('common.edit') : t('admin.add')} {t('about.testimonials.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.name') || 'Name'} *
            </label>
            <input
              type="text"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.role') || 'Role'} *
            </label>
            <input
              type="text"
              value={newTestimonial.role}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.company') || 'Company'}
            </label>
            <input
              type="text"
              value={newTestimonial.company || ''}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.avatarUrl') || 'Avatar URL'}
            </label>
            <input
              type="url"
              value={newTestimonial.avatar_url || ''}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.rating') || 'Rating'} (1-5)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                value={newTestimonial.rating || 5}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (newTestimonial.rating || 5)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {newTestimonial.rating || 5}/5
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.descriptionTr') || 'Content (TR)'} *
            </label>
            <textarea
              value={newTestimonial.content_tr}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content_tr: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.descriptionEn') || 'Content (EN)'} *
            </label>
            <textarea
              value={newTestimonial.content_en}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content_en: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              required
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleAddOrUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingItem ? t('common.save') : t('admin.add')}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map((test: Testimonial, index: number) => (
          <motion.div
            key={test.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                {test.avatar_url ? (
                  <img
                    src={test.avatar_url}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {test.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{test.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {test.role}
                    {test.company && ` at ${test.company}`}
                  </p>
                  {test.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < test.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic line-clamp-3">
              "{test.content_tr || test.content_en}"
            </p>
          </motion.div>
        ))}
        {testimonials.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('admin.noTestimonials') || 'No testimonials. Add your first one!'}
          </div>
        )}
      </div>
    </motion.div>
  );
};