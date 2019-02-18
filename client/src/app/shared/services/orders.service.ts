import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService{
  constructor(private http: HttpClient){}
  // метод для создания заказа
  create(order: Order): Observable<Order>{
    return this.http.post<Order>('/api/order', order)
  }
  // получение списка всех заказаов
  // мы будте передовать гет параметры для дополнительной загрузки заказов
  // HttpParams - удобно позволяет работать с гет параметрами
  fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
}
