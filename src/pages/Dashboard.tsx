import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PunchButton from '../components/PunchButton';

export default function Dashboard() {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEmployee() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/choose-login');
        return;
      }

      const { data: empData } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      setEmployee(empData);
      setLoading(false);
    }

    loadEmployee();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/choose-login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--slate-blue) 0%, var(--cyan) 100%)',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '1rem',
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'var(--slate-dark)',
          }}>
            Welcome, {employee?.full_name || 'Employee'}
          </h1>
          <p style={{ color: 'var(--slate-blue)', fontSize: '0.875rem' }}>
            Employee Code: {employee?.employee_code}
          </p>
        </div>

        <PunchButton />

        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'white',
            color: 'var(--slate-dark)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            marginTop: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
