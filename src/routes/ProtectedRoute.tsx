import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'org_admin' | 'employee' | 'manager';
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Fetch employee record
      const { data: empData } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      setEmployee(empData);
      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/choose-login" state={{ from: location }} replace />;
  }

  if (employee) {
    // Check onboarding
    if (!employee.onboarding_completed && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }

    // Route based on role
    if (employee.role === 'org_admin') {
      if (location.pathname === '/onboarding') {
        return <Navigate to="/admin" replace />;
      }
      if (requireRole && requireRole !== 'org_admin') {
        return <Navigate to="/admin" replace />;
      }
    } else {
      // employee or manager
      if (location.pathname === '/onboarding') {
        return <>{children}</>;
      }
      if (requireRole === 'org_admin') {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
}
