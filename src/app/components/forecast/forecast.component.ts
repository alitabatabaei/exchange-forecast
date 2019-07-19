import { Component, OnInit } from '@angular/core';
import { ExchangeRatesService } from 'src/app/services/exchnage-rates.service';
import { Observable } from 'rxjs';
import { Currency, Currencies } from '../../currencies';

@Component({
  selector: 'exf-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  today = new Date();
  currencies: Array<Currency>;
  loading: Observable<Boolean>;

  constructor(
    private exRates: ExchangeRatesService,
  ) {
    this.loading = exRates.isLoading$;
    this.currencies = Currencies;
  }

  ngOnInit() {
  }

  getRates(query) {
    this.exRates.getRates(query).then(res => {
      console.log('res in forecast component', res);
    });
  }

}
