import { Component,  ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.services';
import { AnalyticsPage } from '../shared/interfaces';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  average: number
  pending = true
  aSub: Subscription


  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(){
    // отрисовываем превый график для выручки
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255,99,132)'
    }

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54,162,235)'
    }

    this.aSub = this.service.getAnalytics().subscribe( (data: AnalyticsPage) => {
      //console.log(data)
      this.average = data.average
      // для графиков
      gainConfig.labels = data.chart.map( item => item.label)
      gainConfig.data = data.chart.map( item => item.gain)

      orderConfig.labels = data.chart.map( item => item.label)
      orderConfig.data = data.chart.map( item => item.order)

      // оживляем графики
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'
      // графики
      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))


      this.pending = false
    })
  }

  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }

  }
}


function createChartConfig({labels, data, label, color}){
  // конфигурируем графиков
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
