import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import EmployeeLogin from './pages/EmployeeLogin';
import AdminLogin from './pages/AdminLogin';
import ChooseLogin from './pages/ChooseLogin';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AdminTestCenter from './pages/AdminTestCenter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/choose-login" element={<ChooseLogin />} />
        <Route path="/login" element={<Navigate to="/choose-login" replace />} />
        
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requireRole="org_admin">
            <AdminTestCenter />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/choose-login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
