import { TestBed } from '@angular/core/testing';

import { StaffScheduleService } from './staff-schedule.service';

describe('StaffScheduleService', () => {
  let service: StaffScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
