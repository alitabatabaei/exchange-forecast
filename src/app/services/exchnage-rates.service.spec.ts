import { TestBed } from '@angular/core/testing';

import { ExchangeRatesService } from './exchnage-rates.service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExchangeRatesService = TestBed.get(ExchangeRatesService);
    expect(service).toBeTruthy();
  });
});
