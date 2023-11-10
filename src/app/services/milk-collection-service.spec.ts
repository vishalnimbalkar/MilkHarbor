import { TestBed } from '@angular/core/testing';

import { MilkCollectionServiceService } from './milk-collection-service';

describe('MilkCollectionServiceService', () => {
  let service: MilkCollectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilkCollectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
