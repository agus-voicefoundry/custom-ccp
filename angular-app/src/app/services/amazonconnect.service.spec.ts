import { TestBed, inject } from '@angular/core/testing';

import { AmazonconnectService } from './amazonconnect.service';

describe('AmazonconnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmazonconnectService]
    });
  });

  it('should be created', inject([AmazonconnectService], (service: AmazonconnectService) => {
    expect(service).toBeTruthy();
  }));
});
