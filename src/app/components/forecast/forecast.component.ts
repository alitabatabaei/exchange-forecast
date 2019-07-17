import { Component, OnInit } from '@angular/core';
import { ExchangeRatesService } from 'src/app/services/exchnage-rates.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'exf-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  today = new Date();
  currencies: Array<string>;
  loading: Observable<boolean>;

  constructor(
    private exRates: ExchangeRatesService,
  ) {
    this.loading = exRates.isLoading$;
    this.currencies = exRates.currencies;
  }

  ngOnInit() {
    this.exRates.getRates({base: 'USD', symbols: ['AUD', 'GBP']}).then(res => {
      console.log('res in forecast component', res);
    });
  }

}
