import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.servisec';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

//Injectable - возможность добавлять некторые в ещи в наш класс
@Injectable()
// interseptor - перехватывает все http запросы и может как то их изменять
// в нашем случае добавлять ко всем запросам token
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private auth: AuthService, private router: Router) {}

//   //HttpRequest<any> - будем перехватывать все реквесты которые будут уходить на сервер
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // мы должны добавлять авторизайшен хедеры для любого запроса как значение указывать токен
//     // если пользователь зарегистрирован он уже вошел в систему зачит уже есть токен авторизации
//     if(this.auth.isAithenticated()){
//       // обновит текущий реквест чтобы он не мутировал
//       req = req.clone({
//         setHeaders: {
//           Authorization: this.auth.getToken()
//         }
//       })
//     }
//     return next.handle(req).pipe(
//       // данный пайп для обработки ошибки
//       catchError(
//         //HttpErrorResponse - специальный тип для обработки ошибок
//         (error: HttpErrorResponse) => { this.handleAuthError(error)}
//       )
//     )

//   }

//   private  handleAuthError(error: HttpErrorResponse): Observable<any> {
//     // попльзователь не имеет токен или неправилльный
//     if(error.status === 401){
//       this.router.navigate(['/login'], {
//         queryParams: {
//           sessionFailed: true
//         }
//       })
//     }

//     return throwError(error)
//   }
// }

export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAithenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.auth.getToken()
        }
      })
    }
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => this.handleAuthError(error)
      )
    )
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      this.router.navigate(['/login'], {
        queryParams: {
          sessionFailed: true
        }
      })
    }

    return throwError(error)
  }
}
