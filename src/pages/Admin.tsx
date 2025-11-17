import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { ProjectManagement } from './admin/ProjectManagement';
import { AboutManagement } from './admin/AboutManagement';
import { CVManagement } from './admin/CVManagement';
import { BlogManagement } from './admin/BlogManagement';
import { FooterManagement } from './admin/FooterManagement';
import { SocialLinksManagement } from './admin/SocialLinksManagement';

export const Admin: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/about" element={<AboutManagement />} />
        <Route path="/cv" element={<CVManagement />} />
        <Route path="/blog" element={<BlogManagement />} />
        <Route path="/footer" element={<FooterManagement />} />
        <Route path="/social-links" element={<SocialLinksManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

