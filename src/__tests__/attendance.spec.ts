import { describe, it, expect } from 'vitest';
import { computeAttendanceDate } from '../lib/app-utils';

describe('Attendance Date Computation', () => {
  it('should use current date for times between 05:30 and 21:00', () => {
    // 10:00 AM
    const morning = new Date('2026-02-02T10:00:00');
    expect(computeAttendanceDate(morning)).toBe('2026-02-02');

    // 3:00 PM
    const afternoon = new Date('2026-02-02T15:00:00');
    expect(computeAttendanceDate(afternoon)).toBe('2026-02-02');

    // 8:00 PM (20:00)
    const evening = new Date('2026-02-02T20:00:00');
    expect(computeAttendanceDate(evening)).toBe('2026-02-02');
  });

  it('should use current date for times between 21:00 and 23:59', () => {
    // 9:00 PM (21:00)
    const nightStart = new Date('2026-02-02T21:00:00');
    expect(computeAttendanceDate(nightStart)).toBe('2026-02-02');

    // 11:00 PM (23:00)
    const lateNight = new Date('2026-02-02T23:00:00');
    expect(computeAttendanceDate(lateNight)).toBe('2026-02-02');

    // 11:59 PM (23:59)
    const endOfDay = new Date('2026-02-02T23:59:00');
    expect(computeAttendanceDate(endOfDay)).toBe('2026-02-02');
  });

  it('should use previous date for times between 00:00 and 05:29', () => {
    // 12:00 AM (00:00) on Feb 2 -> attendance date Feb 1
    const midnight = new Date('2026-02-02T00:00:00');
    expect(computeAttendanceDate(midnight)).toBe('2026-02-01');

    // 3:00 AM on Feb 2 -> attendance date Feb 1
    const earlyMorning = new Date('2026-02-02T03:00:00');
    expect(computeAttendanceDate(earlyMorning)).toBe('2026-02-01');

    // 5:29 AM on Feb 2 -> attendance date Feb 1
    const beforeCutoff = new Date('2026-02-02T05:29:00');
    expect(computeAttendanceDate(beforeCutoff)).toBe('2026-02-01');
  });

  it('should handle overnight shift scenario', () => {
    // Employee punches in at 9:00 PM on Feb 1
    const punchIn = new Date('2026-02-01T21:00:00');
    expect(computeAttendanceDate(punchIn)).toBe('2026-02-01');

    // Employee punches out at 5:00 AM on Feb 2
    const punchOut = new Date('2026-02-02T05:00:00');
    expect(computeAttendanceDate(punchOut)).toBe('2026-02-01');

    // Both punches belong to same attendance date (Feb 1)
    expect(computeAttendanceDate(punchIn)).toBe(computeAttendanceDate(punchOut));
  });

  it('should handle edge case at 05:30', () => {
    // 5:30 AM should use current date
    const cutoff = new Date('2026-02-02T05:30:00');
    expect(computeAttendanceDate(cutoff)).toBe('2026-02-02');
  });
});
