import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
// import { Currency } from 'src/app/currencies';

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
  };

  @Input() data: Array<any>;
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

  compileSets(rates) {
    // console.log('rates', rates);

    let dates = [];
    const datasets = [];
    Object.keys(rates).forEach(key => {
      // console.log(rates[key].map(r => r.date));
      dates = dates.concat(rates[key].map(r => r.date));
      // console.log('key', key, 'dates', dates);
    });

    Object.keys(rates).forEach(key => {
      datasets.push({
        label: key,
        data: dates.map(date => {
          const value = rates[key].find(r => r.date === date);
          return value ? value.amount : null;
        })
      });
    });

    // console.log('%cdates', 'color: pink', dates);
    // console.log('%cdatasets', 'color: pink', datasets);

    const chartData: any = {};
    chartData.labels = dates;
    chartData.datasets = datasets;

    return chartData;
  }

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
