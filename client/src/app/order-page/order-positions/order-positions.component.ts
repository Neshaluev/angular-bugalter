import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from 'src/app/shared/classes/positions.service';
import { Position } from 'src/app/shared/interfaces';
import { switchMap, map } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from 'src/app/shared/classes/material.services';
import {Observable} from 'rxjs/index';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(private route: ActivatedRoute,
              private positionsService: PositionsService,
              private order: OrderService) { }

  ngOnInit() {
    // проверяем какой сейчас айди
    this.positions$ = this.route.params
    .pipe(
      switchMap(
        (params: Params) => {
          // позвращяем позиции по айди категории
          return this.positionsService.fetch(params['id'])
        }
      ),
      // добавляем оператор мап чтобы добавить начальные данные в интпут количество
      map(
        (positions: Position[]) => {
          // накаждой итерации получаем позиции
          return positions.map(position => {
            //каждой позиции по умолчанию добавляем единицу
            position.quantity = 1
            return position
          })
        }
      )
    )
  }

  // добавляем  в заказ
  addToOrder(position: Position){
    //console.log(position)
    // добавляем новую позицию к заказу
    this.order.add(position)
    MaterialService.toast( `${position.name} добавлено.`)
  }
}
