import { TestBed } from '@angular/core/testing';

import { ArcgisServiceService } from './arcgis-service.service';

describe('ArcgisServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArcgisServiceService = TestBed.get(ArcgisServiceService);
    expect(service).toBeTruthy();
  });
});
