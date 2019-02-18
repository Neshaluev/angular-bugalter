import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.services';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order, Filter } from '../shared/interfaces';

// сколько элементов грузим за один раз
const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialInstance
  isFilterVisible = false
  oSub: Subscription
  orders: Order[] = []
  // переменная фильтер
  filter: Filter = {}

  offset = 0
  limit = STEP
  // на дизайблед кнопку когда  показаны все заказы и нужно убрать или заблокировать кнопку загрузить еще
  noMoreOrders = false

  // флаг лоаденг отвечат за загрузку элементов не отвечат за полную загрузку
  loading = false
  // лоадер для всей старинцы
  reloading = false

  constructor( private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloading = true
    // длеаем запрос для получения всех резюме
    // когда загрузится страница
    this.fetch()
  }

  // длема отдельной функцией получения всех резюме
  // будут можество сетуаций когда нужно заргужеть по тербованию резюме
  private fetch(){
    // парметры гет запроса
    // limit - сколько за раз требуется загрузить обьектов
    // offset - указывает номер страницы - в нашем случае дополенине к существующим элементам
    // const params = {
    //   offset: this.offset,
    //   limit: this.limit
    // }
    // в поле парамс получаем поля кторые нужны для фильтрации
    const params  = Object.assign({},this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      // добавляем к общиму массиву итд
      this.orders = this.orders.concat(orders)
      // проверяем закончились заказы или нет
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  ngOnDestroy(){
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }
  ngAfterViewInit(){
    // передаем референцию на элемент тул типа это фильтер
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  loadMore(){
    // это метод показываем индикатор загрузки и оffset
    this.offset += STEP
    this.loading = true
    // и вызываем вывод
    this.fetch()
  }

  applyFilter(filter: Filter) {
    // начинаем фильтрацию с начало и обнуляем массив
    this.orders = []
    this.offset = 0
    this.filter = filter
    // будте полная перезагрузка все компонентов
    this.reloading = true
    // вызываем перевыбор всех копоенетов
    this.fetch()

  }

  // отображать данные в фильтре
  isFiltered(): boolean{
    // если в обьекте фильтр есть какие либо поля то это значит что
    return Object.keys(this.filter).length !== 0
  }
}
