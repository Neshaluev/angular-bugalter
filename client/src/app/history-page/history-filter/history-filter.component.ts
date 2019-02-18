import { Component, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Filter } from 'src/app/shared/interfaces';
import { MaterialService, MaterialDatepicker } from 'src/app/shared/classes/material.services';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
// export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

//   // мы будтем емити данные после нажаитя на конопку
//   @Output() onFilter = new EventEmitter<Filter>()
//   @ViewChild('start') startRef: ElementRef
//   @ViewChild('end') endRef: ElementRef

//   start: MaterialDatepicker
//   end: MaterialDatepicker
//   order: number

//   isValid = true

//   constructor() { }

//   ngOnInit() {
//   }

//   sumbitFilter() {
//     const filter: Filter = {}

//     if (this.order) {
//       filter.order = this.order
//     }

//     if (this.start.date) {
//       filter.start = this.start.date
//     }

//     if(this.end.date) {
//       filter.end = this.end.date
//     }

//     // emit - позволять емититеь или передовать другие данные в компоненты
//     this.onFilter.emit(filter)
//   }

//   ngOnDestroy(){
//     this.start.destroy()
//     this.end.destroy()
//   }
//   ngAfterViewInit(){
//     // инициализации фильтра по дате
//     // this.validate.bind(this) - потомучто используем ключевое слово this
//     this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
//     this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))
//   }

//   validate() {
//     // проверяем интервал между датами начало и конца
//     // надо получить такое сравнение чтобы начло отсчета небыло больше конца тип 20 сентября и 3 сентября  - false
//     //  они не выбраны
//     // this.start.date - undefined
//     if( !this.start.date || !this.end.date) {
//       this.validate = true
//       // возвращяем чтобы небыло работы скрипта дальше
//       return
//     }

//     //console.log(this.start.date < this.end.date)

//     this.isValid = this.start.date < this.end.date
//   }
// }

export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') startRef: ElementRef
  @ViewChild('end') endRef: ElementRef

  start: MaterialDatepicker
  end: MaterialDatepicker
  order: number

  isValid = true

  ngOnDestroy() {
    this.start.destroy()
    this.end.destroy()
  }

  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true
      return
    }

    this.isValid = this.start.date < this.end.date
  }

  submitFilter() {
    const filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }

    if (this.start.date) {
      filter.start = this.start.date
    }

    if (this.end.date) {
      filter.end = this.end.date
    }

    this.onFilter.emit(filter)
  }

}
