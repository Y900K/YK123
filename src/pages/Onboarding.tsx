import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { validateOnboardingForm, normalizeMobile } from '../lib/app-utils';

export default function Onboarding() {
  const [formData, setFormData] = useState({
    full_name: '',
    employee_code: '',
    department_id: '',
    mobile_number: '',
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDepartments() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empData } = await supabase
        .from('employees')
        .select('org_id')
        .eq('user_id', session.user.id)
        .single();

      if (empData) {
        const { data: depts } = await supabase
          .from('departments')
          .select('*')
          .eq('org_id', empData.org_id);

        setDepartments(depts || []);
      }
    }

    loadDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validate
    const validation = validateOnboardingForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubmitError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      // Update employee record
      const { error: updateError } = await supabase
        .from('employees')
        .update({
          full_name: formData.full_name.trim(),
          employee_code: formData.employee_code.trim(),
          department_id: formData.department_id,
          mobile_number: normalizeMobile(formData.mobile_number),
          onboarding_completed: true,
        })
        .eq('user_id', session.user.id);

      if (updateError) {
        setSubmitError(updateError.message);
        setLoading(false);
        return;
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, var(--slate-blue) 0%, var(--cyan) 100%)',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: 'var(--slate-dark)',
        }}>
          Complete Your Profile
        </h1>
        <p style={{
          color: 'var(--slate-blue)',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          Please provide the following information to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.full_name ? '#ef4444' : 'var(--slate-light)'}`,
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
            {errors.full_name && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Employee Code *
            </label>
            <input
              type="text"
              value={formData.employee_code}
              onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.employee_code ? '#ef4444' : 'var(--slate-light)'}`,
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
            {errors.employee_code && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.employee_code}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Department *
            </label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.department_id ? '#ef4444' : 'var(--slate-light)'}`,
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department_id && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.department_id}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Mobile Number *
            </label>
            <input
              type="tel"
              value={formData.mobile_number}
              onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${errors.mobile_number ? '#ef4444' : 'var(--slate-light)'}`,
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
            {errors.mobile_number && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors.mobile_number}
              </p>
            )}
          </div>

          {submitError && (
            <div style={{
              padding: '0.75rem',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}>
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--cyan)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Complete Onboarding'}
          </button>
        </form>
      </div>
    </div>
  );
}
