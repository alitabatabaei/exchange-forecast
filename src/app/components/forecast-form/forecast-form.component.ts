import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from 'src/app/currencies';

@Component({
  selector: 'exf-forecast-form',
  templateUrl: './forecast-form.component.html',
  styleUrls: ['./forecast-form.component.scss']
})
export class ForecastFormComponent implements OnInit {

  inputs = {
    amount: ['1000.00', [Validators.required, Validators.min(0.01)]],
    base: ['', Validators.required],
    symbols: ['', Validators.required],
    weeks: ['1', [Validators.required, Validators.min(1), Validators.max(250)]],
  };

  crForm: FormGroup;

  defaults = {
    base: 'USD',
    symbols: 'EUR'
  };

  @Input() currencies: Array<Currency>;
  @Output() submitForm: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.crForm = this.fb.group(this.inputs);
    if (this.currencies) {
      this.crForm.patchValue({
        base: this.currencies.filter(curr => curr.code === this.defaults.base)[0],
        symbols: this.currencies.filter(curr => curr.code === this.defaults.symbols)[0]
      });
    }
  }

  setWeeks(value) {
    this.crForm.get('weeks').setValue(value);
  }

  swapCurrencies() {
    const base = this.crForm.value.base;
    const symbols = this.crForm.value.symbols;
    this.crForm.get('base').setValue(symbols);
    this.crForm.get('symbols').setValue(base);
  }

  submit() {
    const queries = this.crForm.value;
    console.log(queries);
    this.submitForm.emit(queries);
  }

}
