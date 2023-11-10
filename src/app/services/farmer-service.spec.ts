import { TestBed } from '@angular/core/testing';

import { FarmerServiceService } from './farmer-service';

describe('FarmerServiceService', () => {
  let service: FarmerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
