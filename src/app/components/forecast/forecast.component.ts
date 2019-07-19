import { Component, OnInit } from '@angular/core';
import { ExchangeRatesService, RatesReq, RatesRes } from 'src/app/services/exchnage-rates.service';
import { Observable } from 'rxjs';
import { Currency, Currencies } from '../../currencies';
import * as moment from 'moment';

interface Cash {
  amount: number;
  currency: Currency;
}

@Component({
  selector: 'exf-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  currencies: Array<Currency>;
  target: Cash;

  loading: Observable<Boolean>;
  constructor(
    private exRates: ExchangeRatesService,
  ) {
    this.loading = exRates.isLoading$;
    this.currencies = Currencies;
  }

  ngOnInit() {
  }

  getRates(form) {
    // console.log('%cform received from from', 'color: purple', form);

    const query: RatesReq = {
      base: form.base.code,
      symbols: form.symbols.code
    };

    this.exRates.getRates(query, 'latest').then((res: RatesRes) => {
      this.target = this.calcAmount(form.amount, res.rates[form.symbols.code], form.symbols);
    });

    query.start_at = moment().subtract(form.weeks, 'week').format('YYYY-MM-DD');
    query.end_at = moment().format('YYYY-MM-DD');

    console.log('query', query);

    this.exRates.getRates(query).then((res: RatesRes) => {
      console.log('historical rates: forecast component', res);
    });
  }

  calcAmount(value, rate, currency): Cash {
    return {
      amount: Number((value * rate).toFixed(2)),
      currency: currency
    };
  }

}
