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
    theme = {
        history: {
            borderColor: 'rgba(156, 39, 176, .75)',
            backgroundColor: 'rgba(156, 39, 176, .1)',
            borderWidth: 2
        },
        forecast: {
            borderColor: 'rgba(3, 218, 197, .5)',
            backgroundColor: 'rgba(3, 218, 197, .1)',
            borderWidth: 1
        }
    };
    chartDrawn = false;

    @Input() data: Array<any>;
    @Input() form: any;
    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        // console.log('%cchanges---------------', 'color: blue;', changes);
        // console.log('ngOnChanges', this.data);
        // console.log('ngOnChanges', this.form);
        // console.log('%cchanges', 'color: yellow', changes);
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

        const dates = rates.forecast.map(r => r.date);
        const datasets = [];

        Object.keys(rates).forEach(key => {
            datasets.push({
                ...this.theme[key],
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
        // console.log(this.chart);
    }

    updateChart(data) {
        this.chart.data = this.compileSets(data);
        this.chart.update();
    }

    formatCash(money) {
        return this.form.symbols.symbol + (Math.round(money * 100) / 100).toLocaleString();
    }

    setOptions() {
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
            },
            layout: {
                padding: 0,
            },
            elements: {
                line: {
                    tension: 0
                },
                point: {
                    radius: 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                bodyFontSize: 14,
                caretSize: 6,
                callbacks: {
                    label: (item) => {
                        return this.formatCash(item.yLabel);
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        // minRotation: 0,
                        callback: (v) => {
                            return v.replace(/-/g, '/');
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: (v) => {
                            return this.formatCash(v);
                        }
                    }
                }],
            }
        };

        return options;
    }
}
