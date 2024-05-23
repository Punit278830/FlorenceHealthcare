import { TestBed } from '@angular/core/testing';

import { AbhaDataService } from './abha-data.service';

describe('AbhaDataService', () => {
  let service: AbhaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbhaDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
