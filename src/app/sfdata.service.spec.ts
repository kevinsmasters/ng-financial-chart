import { TestBed } from '@angular/core/testing';

import { SfdataService } from './sfdata.service';

describe('SfdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SfdataService = TestBed.get(SfdataService);
    expect(service).toBeTruthy();
  });
});
