import { describe, it, expect } from 'vitest';
import { runAllChecks, DBClient } from '../lib/app-utils';

// Mock DB client for testing
class MockDBClient implements DBClient {
  private mockData: Record<string, any[]> = {};
  private mockInserts: Record<string, any[]> = {};
  private mockUpdates: Record<string, any[]> = {};
  private mockRpcCalls: Record<string, any[]> = {};

  setMockData(table: string, data: any[]) {
    this.mockData[table] = data;
  }

  getMockInserts(table: string) {
    return this.mockInserts[table] || [];
  }

  getMockUpdates(table: string) {
    return this.mockUpdates[table] || [];
  }

  getMockRpcCalls(fn: string) {
    return this.mockRpcCalls[fn] || [];
  }

  from(table: string) {
    const self = this;
    return {
      select(_columns?: string) {
        let currentData = self.mockData[table] || [];
        const chainableQuery: any = {
          eq(column: string, value: any) {
            currentData = currentData.filter((row) => row[column] === value);
            return chainableQuery; // Return self for chaining
          },
          is(column: string, value: any) {
            currentData = currentData.filter((row) => row[column] === value);
            return chainableQuery; // Return self for chaining
          },
          then(resolve: any) {
            // Make it thenable to work with await
            resolve({ data: currentData, error: null });
          },
        };
        return chainableQuery;
      },
      insert(data: any) {
        if (!self.mockInserts[table]) {
          self.mockInserts[table] = [];
        }
        self.mockInserts[table].push(data);
        return Promise.resolve({ data, error: null });
      },
      update(data: any) {
        let updateColumn: string | null = null;
        let updateValue: any = null;

        const chainableUpdate: any = {
          eq(column: string, value: any) {
            updateColumn = column;
            updateValue = value;
            return chainableUpdate; // Return self for chaining
          },
          is(column: string, value: any) {
            // Apply the final update
            if (!self.mockUpdates[table]) {
              self.mockUpdates[table] = [];
            }
            self.mockUpdates[table].push({ data, column: updateColumn, value: updateValue, isNull: true });
            // Apply update to mock data
            self.mockData[table] = (self.mockData[table] || []).map((row) => {
              if (updateColumn && row[updateColumn] === updateValue && row[column] === value) {
                return { ...row, ...data };
              }
              return row;
            });
            return Promise.resolve({ data, error: null });
          },
          then(resolve: any) {
            // Apply update without is() filter
            if (!self.mockUpdates[table]) {
              self.mockUpdates[table] = [];
            }
            self.mockUpdates[table].push({ data, column: updateColumn, value: updateValue });
            // Apply update to mock data
            if (updateColumn !== null) {
              self.mockData[table] = (self.mockData[table] || []).map((row) =>
                row[updateColumn!] === updateValue ? { ...row, ...data } : row
              );
            }
            resolve({ data, error: null });
          },
        };
        return chainableUpdate;
      },
    };
  }

  rpc(fn: string, params?: any) {
    if (!this.mockRpcCalls[fn]) {
      this.mockRpcCalls[fn] = [];
    }
    this.mockRpcCalls[fn].push(params);
    
    // Simulate seed_shifts creating shifts
    if (fn === 'app_seed_default_shifts') {
      this.mockData.shifts = [
        { id: 'shift-1', org_id: params.p_org_id, name: 'Day Shift' },
        { id: 'shift-2', org_id: params.p_org_id, name: 'Night Shift' },
      ];
    }
    
    return Promise.resolve({ data: null, error: null });
  }
}

describe('Test Center - runAllChecks', () => {
  it('should pass all checks when data is valid', async () => {
    const mockDB = new MockDBClient();
    const orgId = 'org-123';

    // Setup valid data
    mockDB.setMockData('employees', [
      { id: 'emp-1', org_id: orgId, onboarding_completed: true },
      { id: 'emp-2', org_id: orgId, onboarding_completed: false },
    ]);
    mockDB.setMockData('shifts', [
      { id: 'shift-1', org_id: orgId, name: 'Day Shift' },
    ]);
    mockDB.setMockData('departments', [
      { id: 'dept-1', org_id: orgId, name: 'General' },
    ]);

    const results = await runAllChecks(mockDB, orgId, false);

    expect(results).toHaveLength(3);
    expect(results.every((r) => r.status === 'pass')).toBe(true);
  });

  it('should detect and fix employees with null onboarding_completed', async () => {
    const mockDB = new MockDBClient();
    const orgId = 'org-123';

    mockDB.setMockData('employees', [
      { id: 'emp-1', org_id: orgId, onboarding_completed: null },
      { id: 'emp-2', org_id: orgId, onboarding_completed: null },
    ]);
    mockDB.setMockData('shifts', [{ id: 'shift-1', org_id: orgId }]);
    mockDB.setMockData('departments', [{ id: 'dept-1', org_id: orgId, name: 'General' }]);

    const results = await runAllChecks(mockDB, orgId, true);

    const onboardingCheck = results.find((r) => r.name === 'Null onboarding flags');
    expect(onboardingCheck?.status).toBe('fixed');
    expect(onboardingCheck?.message).toContain('Fixed 2 employees');

    const updates = mockDB.getMockUpdates('employees');
    expect(updates.length).toBeGreaterThan(0);
    expect(updates[0].data.onboarding_completed).toBe(false);
  });

  it('should detect and fix missing default shifts', async () => {
    const mockDB = new MockDBClient();
    const orgId = 'org-123';

    mockDB.setMockData('employees', [
      { id: 'emp-1', org_id: orgId, onboarding_completed: true },
    ]);
    mockDB.setMockData('shifts', []); // No shifts
    mockDB.setMockData('departments', [
      { id: 'dept-1', org_id: orgId, name: 'General' },
    ]);

    const results = await runAllChecks(mockDB, orgId, true);

    const shiftsCheck = results.find((r) => r.name === 'Default shifts');
    expect(shiftsCheck?.status).toBe('fixed');

    const rpcCalls = mockDB.getMockRpcCalls('app_seed_default_shifts');
    expect(rpcCalls.length).toBe(1);
    expect(rpcCalls[0].p_org_id).toBe(orgId);
  });

  it('should detect and fix missing General department', async () => {
    const mockDB = new MockDBClient();
    const orgId = 'org-123';

    mockDB.setMockData('employees', [
      { id: 'emp-1', org_id: orgId, onboarding_completed: true },
    ]);
    mockDB.setMockData('shifts', [{ id: 'shift-1', org_id: orgId }]);
    mockDB.setMockData('departments', []); // No departments

    const results = await runAllChecks(mockDB, orgId, true);

    const deptCheck = results.find((r) => r.name === 'General department');
    expect(deptCheck?.status).toBe('fixed');

    const inserts = mockDB.getMockInserts('departments');
    expect(inserts.length).toBe(1);
    expect(inserts[0].name).toBe('General');
    expect(inserts[0].org_id).toBe(orgId);
  });

  it('should only report issues without fixing when applyFixes is false', async () => {
    const mockDB = new MockDBClient();
    const orgId = 'org-123';

    mockDB.setMockData('employees', [
      { id: 'emp-1', org_id: orgId, onboarding_completed: null },
    ]);
    mockDB.setMockData('shifts', []);
    mockDB.setMockData('departments', []);

    const results = await runAllChecks(mockDB, orgId, false);

    expect(results.filter((r) => r.status === 'fail').length).toBeGreaterThan(0);
    expect(results.filter((r) => r.status === 'fixed').length).toBe(0);
    expect(mockDB.getMockUpdates('employees').length).toBe(0);
    expect(mockDB.getMockInserts('departments').length).toBe(0);
    expect(mockDB.getMockRpcCalls('app_seed_default_shifts').length).toBe(0);
  });

  it('should handle multiple issues and fix all of them', async () => {
    const mockDB = new MockDBClient();
    const orgId = 'org-123';

    mockDB.setMockData('employees', [
      { id: 'emp-1', org_id: orgId, onboarding_completed: null },
      { id: 'emp-2', org_id: orgId, onboarding_completed: null },
    ]);
    mockDB.setMockData('shifts', []);
    mockDB.setMockData('departments', []);

    const results = await runAllChecks(mockDB, orgId, true);

    expect(results.every((r) => r.status === 'fixed')).toBe(true);
    expect(mockDB.getMockUpdates('employees').length).toBeGreaterThan(0);
    expect(mockDB.getMockInserts('departments').length).toBe(1);
    expect(mockDB.getMockRpcCalls('app_seed_default_shifts').length).toBe(1);
  });
});
