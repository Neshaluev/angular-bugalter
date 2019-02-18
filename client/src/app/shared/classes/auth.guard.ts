
import { CanActivateChild, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.servisec';

// файл защиты роутов
// providedIn: 'root' - регистрируем сервис
@Injectable({
  providedIn: 'root'
})
//CanActivate CanActivateChild -
export class AuthGuard implements CanActivate, CanActivateChild {

  // имеет ли пользователь токен авторизации и может ли заходить на определнные страницы
  constructor(private auth: AuthService,
    private router: Router) {}

  // если тру то получить страницу если фалсе то защищять
  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    // если пользователь зарегистрирован то
    if(this.auth.isAithenticated()){
      //of
      return of(true)
    }else{
      //незарегистрирова то редирект пользователя на страницу с определенным параметром
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      })
      return of(false)
    }


  }

  canActivateChild(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    // или route
    return this.canActivate(router, state)
  }
}
