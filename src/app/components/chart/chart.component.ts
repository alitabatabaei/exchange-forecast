import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { RatesRes } from 'src/app/services/exchnage-rates.service';
import { Currency } from 'src/app/currencies';

@Component({
  selector: 'exf-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {

  chart: Chart;
  datasetOptions = {
    borderColor: '#9C27B0',
    backgroundColor: 'rgba(105, 240, 174, .25)',
  }

  @Input() data: RatesRes;
  @Input() form: any;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('%cchanges---------------', 'color: blue;', changes);
    console.log('ngOnChanges', this.data);
    console.log('ngOnChanges', this.form);
    console.log('%cchanges', 'color: yellow', changes);
    if (changes.data && changes.data.firstChange) {
      this.drawChart(this.data);
    } else if (changes.data && !changes.data.firstChange) {
      this.updateChart(this.data);
    }
    // console.log(this.config);
    // this.getChartData(this.config);
  }

  compileSets(data) {
    const rates = Object.keys(this.data.rates).sort().map(date => {
      const rate = {};
      rate['date'] = date;
      rate['amount'] = (data.rates[date][this.form.symbols.code] * this.form.amount).toFixed(2);
      return rate;
    });
    console.log("====RATES", rates);

    // const weekly = this.weekAverage(rates, 5);

    const chartData = {
      labels: rates.map(rate => rate['date']),
      datasets: [{
        ...this.datasetOptions,
        data: rates.map(rate => rate['amount'])
      }]
    }

    return chartData;
  }

  // weekAverage(arr, n) {
  //   arr.map((item, i) => {
  //     console.log(i, item);
  //   })
  // }

  drawChart(data) {
    this.chart = new Chart('chart-canvas', {
      type: 'line',
      data: this.compileSets(data),
      options: this.setOptions(),
    });
    console.log(this.chart);
  }

  updateChart(data) {
    this.chart.data = this.compileSets(data);
    this.chart.update();
  }

  setOptions() {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      layout: {
        padding: 0,
      },
      elements: {
        line: {
          tension: 0
        },
        point: {
          radius: 0,
        }
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: false
          },
          ticks: {
            callback: (v) => {
              return v + this.form.symbols.symbol;
            }
          }
        }],
      }
    };

    return options;
  }
}
