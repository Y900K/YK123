import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { runAllChecks, CheckResult } from '../lib/app-utils';
import AdminBanner from '../components/AdminBanner';

export default function AdminTestCenter() {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [runCount, setRunCount] = useState(0);
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

      if (empData?.role !== 'org_admin') {
        navigate('/dashboard');
        return;
      }

      setEmployee(empData);
    }

    loadEmployee();
  }, [navigate]);

  const handleRunChecks = async () => {
    if (!employee) return;

    setLoading(true);
    setResults([]);

    try {
      // Run checks with auto-fixes
      const firstRunResults = await runAllChecks(supabase, employee.org_id, true);
      
      // Run checks again to verify
      const secondRunResults = await runAllChecks(supabase, employee.org_id, false);
      
      setResults(secondRunResults);
      setRunCount(runCount + 1);
    } catch (err: any) {
      console.error('Error running checks:', err);
      setResults([{
        name: 'Error',
        status: 'fail',
        message: err.message || 'An error occurred',
      }]);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/choose-login');
  };

  if (!employee) {
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
      background: '#f8fafc',
    }}>
      <AdminBanner />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'var(--slate-dark)',
          }}>
            Admin Test Center
          </h1>
          <p style={{ color: 'var(--slate-blue)', marginBottom: '1.5rem' }}>
            Run system checks and apply safe auto-fixes
          </p>

          <button
            onClick={handleRunChecks}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              background: 'var(--cyan)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Running Checks...' : 'Run All Checks'}
          </button>
        </div>

        {results.length > 0 && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--slate-dark)',
            }}>
              Check Results (Run #{runCount})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${
                      result.status === 'pass' ? '#10b981' :
                      result.status === 'fixed' ? '#f59e0b' :
                      '#ef4444'
                    }`,
                    borderRadius: '8px',
                    background: 
                      result.status === 'pass' ? '#f0fdf4' :
                      result.status === 'fixed' ? '#fffbeb' :
                      '#fef2f2',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}>
                    <span style={{
                      fontSize: '1.5rem',
                    }}>
                      {result.status === 'pass' ? '✅' :
                       result.status === 'fixed' ? '🔧' :
                       '❌'}
                    </span>
                    <span style={{
                      fontWeight: 'bold',
                      color: 'var(--slate-dark)',
                    }}>
                      {result.name}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      padding: '0.25rem 0.5rem',
                      background: 
                        result.status === 'pass' ? '#10b981' :
                        result.status === 'fixed' ? '#f59e0b' :
                        '#ef4444',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      {result.status}
                    </span>
                  </div>
                  <p style={{
                    color: 'var(--slate-blue)',
                    fontSize: '0.875rem',
                  }}>
                    {result.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'white',
            color: 'var(--slate-dark)',
            border: '1px solid var(--slate-light)',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            marginTop: '2rem',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
