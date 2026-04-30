import { describe, expect, it } from 'vitest';
import { createInquiryValidation } from '../inquiry.validation';
import { createVisitValidation, updateVisitStatusValidation } from '../visit.validation';
import { createSavedSearchValidation } from '../savedSearch.validation';
import { createReportValidation } from '../admin.validation';

describe('domain validation schemas', () => {
  it('accepts a valid inquiry payload', () => {
    const payload = {
      propertyId: '507f1f77bcf86cd799439011',
      message: 'I am interested in this listing and want to schedule a call.',
      contactEmail: 'buyer@example.com',
    };

    const { error } = createInquiryValidation.validate(payload);
    expect(error).toBeUndefined();
  });

  it('rejects reschedule updates when schedule times are missing', () => {
    const payload = { status: 'rescheduled' };
    const { error } = updateVisitStatusValidation.validate(payload);
    expect(error).toBeDefined();
  });

  it('accepts a valid visit request payload', () => {
    const payload = {
      propertyId: '507f1f77bcf86cd799439011',
      requestedStartAt: '2030-01-01T10:00:00.000Z',
      requestedEndAt: '2030-01-01T11:00:00.000Z',
      requesterNote: 'Please call me before confirming.',
    };

    const { error } = createVisitValidation.validate(payload);
    expect(error).toBeUndefined();
  });

  it('accepts a valid saved search payload', () => {
    const payload = {
      name: 'Colombo apartments',
      filters: { type: 'apartment', city: 'Colombo', maxPrice: 50000000 },
      frequency: 'daily',
    };

    const { error } = createSavedSearchValidation.validate(payload);
    expect(error).toBeUndefined();
  });

  it('accepts a valid report payload', () => {
    const payload = {
      targetType: 'property',
      targetId: '507f1f77bcf86cd799439011',
      reason: 'misleading_information',
      description: 'Listing says 4 bedrooms but photos show 2.',
    };

    const { error } = createReportValidation.validate(payload);
    expect(error).toBeUndefined();
  });
});
