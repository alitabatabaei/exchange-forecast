import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

export interface RatesRes {
  rates: any;
  base?: string;
  date?: string;
  start_at?: string;
  end_at?: string;
  error?: any;
}

export interface RatesReq {
  base?: string;
  symbols?: string;
  start_at?: string;
  end_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  baseUrl = 'https://api.exchangeratesapi.io';
  endpoints = {
    latest: '/latest',
    history: '/history'
  };

  private loading$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loading$.asObservable();

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
  ) { }

  public getRates(params = {}, type = 'history') {

    // console.log(params);
    // console.log('params', params, 'type', type);
    const query = this.serializeParams(params);
    const uri = `${this.baseUrl}${this.endpoints[type]}${query}`;
    // console.log(uri);
    this.loading$.next(true);
    return this.http.get(uri)
      .toPromise()
      .then((res: RatesRes) => {
        this.loading$.next(false);
        // console.log('%cres', 'color: green', res);
        if (res.error) {
          this.message(res.error);
        }
        return res;
      })
      .catch((err: HttpErrorResponse) => {
        this.loading$.next(false);
        // console.log('%cerr', 'color: red', err);
        // console.log(err.status, err.statusText);
        // console.log('%cerr.error.error', 'color: pink', err.error.error);
        return err;
      });
  }

  serializeParams(params) {
    const query = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return query ? `?${query}` : '';
  }

  message(text) {
    this.snackBar.open(text, 'dismiss', {
      duration: 5000
    });
  }
}
