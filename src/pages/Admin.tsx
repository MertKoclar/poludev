import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { ProjectManagement } from './admin/ProjectManagement';
import { AboutManagement } from './admin/AboutManagement';
import { CVManagement } from './admin/CVManagement';

export const Admin: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/about" element={<AboutManagement />} />
        <Route path="/cv" element={<CVManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

