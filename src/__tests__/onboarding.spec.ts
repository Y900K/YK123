import { describe, it, expect } from 'vitest';
import { validateOnboardingForm, normalizeMobile } from '../lib/app-utils';

describe('Onboarding Validation', () => {
  it('should validate valid onboarding data', () => {
    const validData = {
      full_name: 'John Doe',
      employee_code: 'EMP001',
      department_id: 'dept-123',
      mobile_number: '1234567890',
    };

    const result = validateOnboardingForm(validData);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should reject empty full name', () => {
    const data = {
      full_name: '',
      employee_code: 'EMP001',
      department_id: 'dept-123',
      mobile_number: '1234567890',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.full_name).toBeDefined();
  });

  it('should reject full name with less than 2 characters', () => {
    const data = {
      full_name: 'A',
      employee_code: 'EMP001',
      department_id: 'dept-123',
      mobile_number: '1234567890',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.full_name).toBeDefined();
  });

  it('should reject empty employee code', () => {
    const data = {
      full_name: 'John Doe',
      employee_code: '',
      department_id: 'dept-123',
      mobile_number: '1234567890',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.employee_code).toBeDefined();
  });

  it('should reject empty department', () => {
    const data = {
      full_name: 'John Doe',
      employee_code: 'EMP001',
      department_id: '',
      mobile_number: '1234567890',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.department_id).toBeDefined();
  });

  it('should reject mobile number with less than 10 digits', () => {
    const data = {
      full_name: 'John Doe',
      employee_code: 'EMP001',
      department_id: 'dept-123',
      mobile_number: '12345',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.mobile_number).toBeDefined();
  });

  it('should normalize mobile number by removing non-digits', () => {
    expect(normalizeMobile('123-456-7890')).toBe('1234567890');
    expect(normalizeMobile('(123) 456-7890')).toBe('1234567890');
    expect(normalizeMobile('+1 123 456 7890')).toBe('11234567890');
    expect(normalizeMobile('123.456.7890')).toBe('1234567890');
  });

  it('should accept mobile with formatting if digits are valid', () => {
    const data = {
      full_name: 'John Doe',
      employee_code: 'EMP001',
      department_id: 'dept-123',
      mobile_number: '(123) 456-7890',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(true);
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const data = {
      full_name: 'A',
      employee_code: '',
      department_id: '',
      mobile_number: '123',
    };

    const result = validateOnboardingForm(data);
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBe(4);
    expect(result.errors.full_name).toBeDefined();
    expect(result.errors.employee_code).toBeDefined();
    expect(result.errors.department_id).toBeDefined();
    expect(result.errors.mobile_number).toBeDefined();
  });
});
