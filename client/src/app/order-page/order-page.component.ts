import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MaterialService, MaterialInstance } from '../shared/classes/material.services';
import { OrderService } from './order.service';
import { OrderPosition, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

// providers: [OrderService] - Локальная регистарция сервес на компонент
@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
//OnDestroy - уничтожение после перехода старницы
//AfterViewInit - позволяет рабоать с дом дерево когда сфорируется в деереве
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  // для определение на какой странице находимся
  isRoot: boolean
  modal: MaterialInstance
  // блокирование кнопки заказа на одно нажатие
  panding = false
  oSub: Subscription

  // по средству роутера проверяем юрл адрес и тем самы отображение хлебных крошек
  constructor(private router: Router,
              private order: OrderService,
              private ordersService: OrdersService ) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order'
    //ставим прослушку события на именения страниц
    this.router.events.subscribe(
      event => {
        // противном случае будет false и будем показывать другое меню
        // console.log(Event,event)
        // оптимизация если эвет наследник слава навигатион ентд
        // в таком случае один раз переопределим эту пременную
        if(event instanceof NavigationEnd){
          this.isRoot = this.router.url === '/order'
        }

      }
    )
  }

  ngOnDestroy(){
    // удаляем модальное окно
    this.modal.destroy()
    if(this.oSub){
      // отприсываемся от потоков
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit(){
    // инициализируем модальное окно
    this.modal = MaterialService.initModal(this.modalRef)
  }

  open(){
    this.modal.open()
  }

  cancel(){
    this.modal.close()
  }

  submit(){
    this.panding = true
    // создание нового заказа
    // должы в листе избавится от айди листа через мап
    const order: Order = {
      list: this.order.list.map( item => {
        // укаждого айтема удаляем поле айди
        delete item._id
        return item
      })
    }
    this.oSub = this.ordersService.create(order).subscribe(
      (newOrder) => {
        MaterialService.toast(`Заказ добавлен №${newOrder.order}`)
        this.order.clear()
      },
      error => {MaterialService.toast(error.error.message)},
      () => {
        this.modal.close()
        this.panding = true
      }
    )

  }

  removePosition(orderPosition: OrderPosition){
    this.order.remove(orderPosition)
    MaterialService.toast(`${orderPosition.name} удален.`)
  }
}
