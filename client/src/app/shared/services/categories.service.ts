import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Message } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// сервис который работает с категориями

export class CategoriesService {
  constructor(private http: HttpClient){}
  //получаем список всех категорий
  fetch(): Observable<Category[]>{
    return this.http.get<Category[]>('/api/category')
  }
  // метод получение одной категории по айди
  getById(id:string): Observable<Category>{
    return this.http.get<Category>(`/api/category/${id}`)
  }
  // метод позволяет создавать новые категории
  create(name: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if(image){
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    return this.http.post<Category>('/api/category', fd)
  }
  // обновление
  update(id: string, name: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if(image){
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    return this.http.patch<Category>(`/api/category/${id}`, fd)
  }
  // удаление
  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/category/${id}`)
  }
}
