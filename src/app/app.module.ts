import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCoreModule } from './modules/mat-core/mat-core.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ForecastComponent } from './components/forecast/forecast.component';
import { ForecastFormComponent } from './components/forecast-form/forecast-form.component';

import { NgxMaskModule } from 'ngx-mask';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ForecastComponent,
    ForecastFormComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    MatCoreModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
