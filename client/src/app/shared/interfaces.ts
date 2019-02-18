import { MaterialInstance } from './classes/material.services';

// интефейс для юзера при логировании
export interface User {
  email: string
  password: string
}

// интерфес для категорий
// imageSrc?: string - необезатлеьное поле
// при создании не можем выдавать айди это тольок делаем бэкенд
export interface Category {
  name: string
  imageSrc?: string
  user?: string
  _id?: string
}

// интерфес для обработки формата json c меседжем приходят с сервера
export interface Message{
  message: string
}

// интерфейс для позиций или товара
// quantity - виртуальное поле
export interface Position {
  name: string
  cost: number
  user?: string
  category: string
  _id?: string
  quantity?: number
}

// модель заказа
export interface Order{
 date?: Date
 order?: number
 user?: string
 list: OrderPosition[]
 _id?: string
}
// модель листа заказа
export interface OrderPosition{
  name: string
  cost: number
  quantity: number
  _id?: string
}
// модель фильтра
export interface Filter{
  start?: Date
  end?: Date
  order?: number
}
// интерфес аналитики или овервью
export interface OverviewPage {
  orders: OverviewPageItem
  gain: OverviewPageItem
}

export interface OverviewPageItem{
  parcent: number
  compare: number
  yesterday: number
  isHigher: boolean
}

export interface AnalyticsPage {
  average: number
  chart: AnalyticsChartItem[]
}

export interface AnalyticsChartItem {
  gain: number
  order: number
  label: string
}
