import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'exf-forcast-form',
  templateUrl: './forcast-form.component.html',
  styleUrls: ['./forcast-form.component.scss']
})
export class ForcastFormComponent implements OnInit {

  inputs = {
    amount: ['10', Validators.min(0.01)],
    base: ['USD'],
    symbols: [['EUR']],
    weeks: ['1', [Validators.required, Validators.min(1), Validators.max(250)]],
  };

  crForm: FormGroup;

  @Input() currencies: Array<string>;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.crForm = this.fb.group(this.inputs);
    console.log(this.crForm);
  }

  // sliderLabel(value) {
  //   return value.toString() + 'w';
  // }

}
