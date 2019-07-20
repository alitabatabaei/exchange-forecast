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
  formData;
  rates: any;
  loading: Observable<boolean>;
  constructor(
    private exRates: ExchangeRatesService,
  ) {
    this.loading = exRates.isLoading$;
    this.currencies = Currencies;
  }

  ngOnInit() {
  }

  getRates(form) {
    console.log('%cform received from form', 'color: purple', form);
    this.formData = form;

    const query: RatesReq = {
      base: form.base.code,
      symbols: form.symbols.code
    };

    this.exRates.getRates(query, 'latest').then((res: RatesRes) => {
      this.target = this.calcAmount(form.amount, res.rates[form.symbols.code], form.symbols);
    });

    // now in European Central bank
    const now = moment().utc().add(1, 'hour');

    query.end_at = now.format('YYYY-MM-DD');
    query.start_at = now
      .subtract((Number(form.weeks) * 7) - 1, 'days')
      .format('YYYY-MM-DD');

    console.log('query', query);

    this.exRates.getRates(query).then((res: RatesRes) => {
      // console.log('historical rates: forecast component', res);
      this.rates = this.formatRates(res, form);
    });
  }

  formatRates(data: RatesRes, form) {
    const rates = Object.keys(data.rates)
      .sort((a, b) => a < b ? 1 : -1)
      .map(date => {
        const rate: any = {};
        rate.date = date;
        rate.amount = (data.rates[date][form.symbols.code] * form.amount).toFixed(2);
        return rate;
      })
      .filter((rate, i, arr) => new Date(rate.date).getDay() === new Date(arr[0].date).getDay())
      .reverse();
    console.log('%cformatRates(data: RatesRes, form)', 'color: yellowgreen', rates);
    return rates;
  }

  calcAmount(value, rate, currency): Cash {
    const cash: any = {};
    cash.amount = Number((value * rate).toFixed(2));
    cash.currency = currency;
    return cash;
  }

}
