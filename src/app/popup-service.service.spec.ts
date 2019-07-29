import { TestBed } from '@angular/core/testing';

import { PopupServiceService } from './popup-service.service';

describe('PopupServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopupServiceService = TestBed.get(PopupServiceService);
    expect(service).toBeTruthy();
  });
});
