import { TestBed } from '@angular/core/testing';

import { MedicinesGroupService } from './medicines-group.service';

describe('MedicinesGroupService', () => {
  let service: MedicinesGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicinesGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
