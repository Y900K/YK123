import { Link } from 'react-router-dom';

export default function ChooseLogin() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, var(--slate-blue) 0%, var(--cyan) 100%)',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textAlign: 'center',
          color: 'var(--slate-dark)',
        }}>
          Astra Attendance
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--slate-blue)',
          marginBottom: '2rem',
        }}>
          Choose your login type
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link
            to="/employee/login"
            style={{
              display: 'block',
              padding: '1.5rem',
              background: 'var(--cyan)',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '1.125rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Employee Login
          </Link>

          <Link
            to="/admin/login"
            style={{
              display: 'block',
              padding: '1.5rem',
              background: 'var(--slate-dark)',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '1.125rem',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
