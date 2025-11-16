import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
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
  AlertCircle
} from 'lucide-react';

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

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects stats
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, featured, status');

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

      // Generate recent activities (mock - can be improved with actual activity log)
      const activities: RecentActivity[] = projects?.slice(0, 5).map((p: any, index: number) => ({
        id: p.id,
        type: 'project' as const,
        action: index % 3 === 0 ? 'created' as const : 'updated' as const,
        title: p.title_tr || 'Project',
        timestamp: new Date(Date.now() - index * 3600000).toISOString(),
      })) || [];

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.action === 'created' ? 'bg-green-100 dark:bg-green-900/30' :
                    activity.action === 'updated' ? 'bg-orange-600 dark:bg-orange-600/30' :
                    'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {activity.action === 'created' ? (
                      <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : activity.action === 'updated' ? (
                      <Edit className="w-4 h-4 text-orange-600 dark:text-orange-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.action} • {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))
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
    </div>
  );
};

