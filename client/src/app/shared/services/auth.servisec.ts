import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// файлы сервесов авторизации

// providedIn - регистрирует сервес в корневом элементе  - ненадо нечего писать в провайдере providers app.module.ts
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // полученный токен авторизации
  private token = null

  // инжектируем http клиент для запросов на сервер
  constructor(private http: HttpClient) {

  }

  // функция регистрации в системе
  // при регистрации возвращяем пользователя которого мы создали
  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
  }

  // функция захождения в нашу систему
  // User - опсание тип интерфес
  // из функции возвращяют Observable Тип возвращяемых значений <> - сервер возвращяет токен
  login(user: User): Observable<{token: string}> {
    // код по работе с сервером
    return this.http.post<{token: string}>('/api/auth/login', user)
    .pipe(
      // операторы по цепоче вызываются когда работает стрим
      // после того как сделан запрос проводим дейтсвие
      // tap выципляем из стрима
      tap(
        ({token}) => {
          // локал сторедж заносим токен
          localStorage.setItem('auth-token', token)
          // заносим значение токена в приватную переменную
          this.setToken(token)
        }
      )
    )
  }

  // Данный метод изменяет приватную переменную
  setToken(token: string) {
    this.token = token
  }
  // данный метод возвращяет тип стринг
  getToken(): string {
    return this.token
  }
  // переменная определяет находистя ли в сессии пользователь или нет
  isAithenticated(): boolean {
    return !!this.token
  }
  // выхода из системы логаут
  logaut() {
    // обнуляем занчения токен
    this.setToken(null)
    // обнуляем локал сторендж
    localStorage.clear
  }
}
