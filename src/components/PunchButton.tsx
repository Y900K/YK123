import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { computeAttendanceDate } from '../lib/app-utils';

export default function PunchButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePunch = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage('Not authenticated');
        setLoading(false);
        return;
      }

      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!employee || !employee.onboarding_completed) {
        setMessage('Please complete onboarding first');
        setLoading(false);
        return;
      }

      const now = new Date();
      const attendanceDate = computeAttendanceDate(now);

      // Record punch (this assumes an attendance_punches table exists)
      // For demo purposes, we'll just show a success message
      setMessage(`Punch recorded at ${now.toLocaleTimeString()} for attendance date ${attendanceDate}`);
      setLoading(false);
    } catch (err: any) {
      setMessage(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }}>
      <button
        onClick={handlePunch}
        disabled={loading}
        style={{
          width: '100%',
          padding: '2rem',
          background: 'var(--cyan)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Recording...' : 'PUNCH IN/OUT'}
      </button>

      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: message.includes('error') ? '#fee2e2' : '#dcfce7',
          color: message.includes('error') ? '#991b1b' : '#166534',
          borderRadius: '4px',
          fontSize: '0.875rem',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
