import { TestBed } from '@angular/core/testing';

import { NavExtrasService } from './nav-extras.service';

describe('NavExtrasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavExtrasService = TestBed.get(NavExtrasService);
    expect(service).toBeTruthy();
  });
});
