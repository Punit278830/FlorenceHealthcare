import { TestBed } from '@angular/core/testing';

import { AbhaService } from './abha.service';

describe('AbhaService', () => {
  let service: AbhaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbhaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
