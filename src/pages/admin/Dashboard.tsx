import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { USER_IDS } from '../../config/constants';
import { 
  Rocket, 
  Users, 
  FileText, 
  Plus, 
  Edit, 
  Upload,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Map
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  projects: number;
  featuredProjects: number;
  activeProjects: number;
  completedProjects: number;
  users: number;
  aboutEntries: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'about' | 'cv';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  timestamp: string;
}

interface ProjectByCategory {
  category: string;
  count: number;
}

interface ProjectByStatus {
  status: string;
  count: number;
  [key: string]: string | number;
}

export const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    featuredProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    users: 0,
    aboutEntries: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsByCategory, setProjectsByCategory] = useState<ProjectByCategory[]>([]);
  const [projectsByStatus, setProjectsByStatus] = useState<ProjectByStatus[]>([]);
  const [generatingSitemap, setGeneratingSitemap] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects stats
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, featured, status, title_tr, title_en, created_at, updated_at');

      if (projectsError) throw projectsError;

      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Fetch about entries count
      const { count: aboutCount, error: aboutError } = await supabase
        .from('about_us')
        .select('*', { count: 'exact', head: true });

      if (aboutError) throw aboutError;

      // Calculate stats
      const featuredProjects = projects?.filter(p => p.featured).length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;

      setStats({
        projects: projects?.length || 0,
        featuredProjects,
        activeProjects,
        completedProjects,
        users: usersCount || 0,
        aboutEntries: aboutCount || 0,
      });

      // Calculate projects by category
      const categoryCounts: Record<string, number> = {};
      projects?.forEach((p: any) => {
        const category = p.category || 'other';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      setProjectsByCategory(
        Object.entries(categoryCounts).map(([category, count]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count,
        }))
      );

      // Calculate projects by status
      const statusCounts: Record<string, number> = {};
      projects?.forEach((p: any) => {
        const status = p.status || 'active';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setProjectsByStatus(
        Object.entries(statusCounts).map(([status, count]) => ({
          status: status.replace('-', ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          count,
        }))
      );

      // Fetch dynamic recent activities
      await fetchRecentActivities();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const lang = i18n.language as 'tr' | 'en';
      const activities: RecentActivity[] = [];

      // Fetch recent projects
      const { data: recentProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id, title_tr, title_en, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (!projectsError && recentProjects) {
        recentProjects.forEach((project: any) => {
          const title = lang === 'tr' ? project.title_tr : project.title_en;
          const createdTime = new Date(project.created_at).getTime();
          const updatedTime = project.updated_at ? new Date(project.updated_at).getTime() : createdTime;
          
          // If updated recently (within 1 hour of creation, consider it as created)
          // Otherwise, use the most recent timestamp
          const isRecentlyCreated = Math.abs(updatedTime - createdTime) < 3600000; // 1 hour
          
          activities.push({
            id: `project-${project.id}`,
            type: 'project',
            action: isRecentlyCreated ? 'created' : 'updated',
            title: title || 'Project',
            timestamp: isRecentlyCreated ? project.created_at : project.updated_at || project.created_at,
          });
        });
      }

      // Fetch recent about_us updates
      const { data: recentAbout, error: aboutError } = await supabase
        .from('about_us')
        .select('id, user_id, updated_at, created_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (!aboutError && recentAbout) {
        recentAbout.forEach((about: any) => {
          const createdTime = new Date(about.created_at).getTime();
          const updatedTime = about.updated_at ? new Date(about.updated_at).getTime() : createdTime;
          const isRecentlyCreated = Math.abs(updatedTime - createdTime) < 3600000;
          
          const userName = about.user_id === USER_IDS.MERT ? 'Mert' : about.user_id === USER_IDS.MUSTAFA ? 'Mustafa' : 'User';
          activities.push({
            id: `about-${about.id}`,
            type: 'about',
            action: isRecentlyCreated ? 'created' : 'updated',
            title: `About Us (${userName})`,
            timestamp: isRecentlyCreated ? about.created_at : about.updated_at || about.created_at,
          });
        });
      }

      // Fetch recent CV uploads
      const { data: recentCVs, error: cvError } = await supabase
        .from('cv_versions')
        .select('id, user_id, version, uploaded_at, created_at')
        .order('uploaded_at', { ascending: false })
        .limit(5);

      if (!cvError && recentCVs) {
        recentCVs.forEach((cv: any) => {
          const userName = cv.user_id === USER_IDS.MERT ? 'Mert' : cv.user_id === USER_IDS.MUSTAFA ? 'Mustafa' : 'User';
          activities.push({
            id: `cv-${cv.id}`,
            type: 'cv',
            action: 'created',
            title: `CV Version ${cv.version} (${userName})`,
            timestamp: cv.uploaded_at || cv.created_at,
          });
        });
      }

      // Sort all activities by timestamp (most recent first) and take top 10
      activities.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      setRecentActivities(activities.slice(0, 10));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const quickActions = [
    {
      icon: Plus,
      label: t('admin.addProject'),
      link: '/admin/projects',
      color: 'bg-orange-600 hover:bg-orange-600',
    },
    {
      icon: Edit,
      label: t('admin.aboutManagement'),
      link: '/admin/about',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Upload,
      label: t('admin.cvManagement'),
      link: '/admin/cv',
      color: 'bg-amber-600 hover:bg-amber-600',
    },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffInMinutes < 1) return t('admin.justNow') || 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} ${t('admin.minutesAgo') || 'minutes ago'}`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${t('admin.hoursAgo') || 'hours ago'}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t('admin.daysAgo') || 'days ago'}`;
  };

  const handleGenerateSitemap = async () => {
    setGeneratingSitemap(true);
    try {
      // generateSitemap fonksiyonunu kullan
      const { generateSitemap } = await import('../../utils/generateSitemap');
      const xml = await generateSitemap();
      
      // XML'i blob olarak indir
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Sitemap başarıyla oluşturuldu ve indirildi! Dosyayı public/sitemap.xml konumuna kopyalayın.');
    } catch (error) {
      console.error('Sitemap oluşturma hatası:', error);
      alert('Sitemap oluşturulurken bir hata oluştu. Lütfen konsolu kontrol edin.');
    } finally {
      setGeneratingSitemap(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {t('admin.dashboard')}
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('admin.dashboardDescription') || 'Welcome to the admin dashboard'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-600 to-orange-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Rocket className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{stats.projects}</h3>
          <p className="text-orange-600">{t('admin.totalProjects') || 'Total Projects'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-600 to-amber-600 p-4 sm:p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.featuredProjects}</h3>
          <p className="text-amber-600">{t('admin.featuredProjects') || 'Featured Projects'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-4 sm:p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.users}</h3>
          <p className="text-green-100">{t('admin.totalUsers') || 'Total Users'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 sm:p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8" />
            <AlertCircle className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.activeProjects}</h3>
          <p className="text-orange-100">{t('admin.activeProjects') || 'Active Projects'}</p>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.quickActions') || 'Quick Actions'}
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-lg transition-colors`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{action.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleGenerateSitemap}
              disabled={generatingSitemap}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors w-full"
            >
              {generatingSitemap ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sitemap Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Map className="w-5 h-5" />
                  <span>Sitemap Oluştur</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.recentActivity') || 'Recent Activity'}
          </h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const getActivityLink = () => {
                  if (activity.type === 'project') {
                    return `/admin/projects`;
                  } else if (activity.type === 'about') {
                    return `/admin/about`;
                  } else if (activity.type === 'cv') {
                    return `/admin/cv`;
                  }
                  return '#';
                };

                const getActionLabel = () => {
                  if (activity.action === 'created') {
                    return t('admin.created') || 'created';
                  } else if (activity.action === 'updated') {
                    return t('admin.updated') || 'updated';
                  } else if (activity.action === 'deleted') {
                    return t('admin.deleted') || 'deleted';
                  }
                  return activity.action;
                };

                return (
                  <Link
                    key={activity.id}
                    to={getActivityLink()}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      activity.action === 'created' ? 'bg-green-100 dark:bg-green-900/30' :
                      activity.action === 'updated' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {activity.action === 'created' ? (
                        <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : activity.action === 'updated' ? (
                        <Edit className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getActionLabel()} • {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                {t('admin.noRecentActivity') || 'No recent activity'}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.projectManagement')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('admin.manageProjects') || 'Manage your projects, add, edit or delete them.'}
          </p>
          <Link
            to="/admin/projects"
            className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t('common.view')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.aboutManagement')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('admin.manageAbout') || 'Update about us information.'}
          </p>
          <Link
            to="/admin/about"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('common.view')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('admin.cvManagement')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('admin.manageCV') || 'Upload or update CV files.'}
          </p>
          <Link
            to="/admin/cv"
            className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {t('common.view')}
          </Link>
        </motion.div>
      </div>

      {/* Charts Section */}
      {(projectsByCategory.length > 0 || projectsByStatus.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Projects by Category Chart */}
          {projectsByCategory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Projects by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Projects by Status Chart */}
          {projectsByStatus.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Projects by Status
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.status} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {projectsByStatus.map((_entry, index) => {
                      const colors = ['#f97316', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    }) as React.ReactNode[]}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

