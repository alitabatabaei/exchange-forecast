import { Component, OnInit } from '@angular/core';
import { ExchangeRatesService, RatesReq, RatesRes } from 'src/app/services/exchnage-rates.service';
import { Observable } from 'rxjs';
import { Currency, Currencies } from '../../currencies';
import * as moment from 'moment';
import * as zodiac from 'zodiac-ts';

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
    private exRates: ExchangeRatesService
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
      this.rates = {};
      // console.log('historical rates: forecast component', res);
      const rates = this.formatRates(res, form);
      this.rates.histoy = rates;
      this.rates.DES = this.predict(rates);
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
      // .filter((rate, i, arr) => new Date(rate.date).getDay() === new Date(arr[0].date).getDay())
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

  predict(rates) {
    console.log(rates);
    const values = rates.map(rate => Number(rate.amount));
    console.log(values);

    const lastDate = moment(rates[rates.length - 1].date);
    console.log(lastDate.format('YYYY-MM-DD'));

    const data = values;
    const alpha = 0.4;

    const des = new zodiac.DoubleExponentialSmoothing(data, alpha);
    const forecast = des.predict(3);
    console.log('forecast values', forecast);
    const result = forecast.slice(2).map((value, i, arr) => {
      const rate: any = {};
      rate.amount = value.toFixed(2);
      rate.date = lastDate.add(1, 'week').format('YYYY-MM-DD');
      return rate;
    });
    console.log('forecast rates', result);
    return result;
  }

}
