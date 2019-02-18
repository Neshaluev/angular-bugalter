import { Injectable } from '@angular/core';
import { Position, OrderPosition } from '../shared/interfaces';

@Injectable()
// сервесы заказа

// локальный спомогательный класс кторый формирует заказ
export class OrderService{
  // массив заказов
  public list: OrderPosition[] = []
  //общая цена
  public price = 0

  add(position: Position){
    // иза не совпадения типов сформируем правильный обьект
    // но возможны мутации в js из за несовпадения ольектов потомушто пеердаем сылки для этого создаем обьект
    // assign спомощью этого метода можем создавать новые обьеты и унаследовать друг от друга
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })
    // проверяем на наличе похожего товара что бы небыло дубликатов
    // ищем на наличе похожих айдишников в листе
    const candidate = this.list.find( p => p._id === position._id)
    if(candidate){
       //изменяем количество
       candidate.quantity += orderPosition.quantity
    } else {
      // до добавляем заказ
      this.list.push(orderPosition)
    }

    this.computePrice()

  }
  remove(orderPosition: OrderPosition){
    // удлаение
    // находим элемент из массива и удалем
    const idx = this.list.findIndex(p => p._id === orderPosition._id)
    this.list.splice(idx, 1)
    // пересчитываем цену
    this.computePrice()
  }
  // после отпарвки очищяет сервис
  clear(){
    this.list = []
    this.price = 0
  }

  // приватный метод высчитывание общей цены
  private computePrice(){
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0)
  }
}
