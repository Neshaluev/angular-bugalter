import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.servisec';

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: '<router-outlet></router-outlet>',
  // styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // логика если есть валдный элемент в локал сторедже то автоматически будем задавать токен в наш сервес
  constructor(private auth: AuthService){

  }

  // при создания приложения проверяем локал сторенд если он не пуст то заносим в сервес
  // в headerah Должен быть поле авторизация с токеном
  ngOnInit(){
    const potentialToken = localStorage.getItem('auth-token')
    if(potentialToken !== null){
      this.auth.setToken(potentialToken)
    }
  }
}
