import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.servisec';
import {  Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MaterialService } from '../shared/classes/material.services';

// Component - декоратор компонента
// OnInit - этот метод вызывется когда компонент будет проинициализированн

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
//OnDestroy - после уничтожения компонента - типо временной цикл
export class LoginPageComponent implements OnInit, OnDestroy {

  // указываем пременную и передают через воеточение тип FormGroup
  // Subscription - отвечает за утечку памяти
  form: FormGroup
  aSub: Subscription

  // вствляем созданный сервес
  // дополнительные сервесы Router,ActivatedRoute
  constructor(private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  // инициализируем
  // описываем контолы пароль емейл
  ngOnInit() {
    this.form = new FormGroup({
      // значение по умолчанию , валидаторы которые применяются к полю формы
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(2)])
    })

    // информация о текущем роуте
    // принимаем переменную типа Params
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']){
        MaterialService.toast('Теперь вы можете зайти в сестему используя свои данные')
      } else if (params['accessDenied']) {
        // нужно авторизироватся защищеные роуты
        MaterialService.toast('Для начала сессии авторизируйтесь в системе')
      } else if(params['sessionFailed']) {
        MaterialService.toast('Пожалуйста войдите в систему заново')
      }

    })
  }
  ngOnDestroy(){
    //вызывится после уничтожения компонента логин
    // отписываемся от стрима на котором подписались для прослушивания события
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
  // реализуем метод он субмит
  onSubmit(){
    // для облегчения нагрузки на сервер чтобы пользователь один раз нажимал когда идет некоторый запрос
    this.form.disable()
    // нужно в импортированный метод вставить пользователя
    // const user = {
    //   email: this.form.value.email,
    //   password: this.form.value.password
    // }

    // subscribe - подписываемся на событие и просматриваем его
    // aSub - чтобы небыло утечки памяти при subscribe после нажатия кноки
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        console.log('Login success')
        // импортировали сервес и используем для перехода на другую страницу
        this.router.navigate(['/overview'])
      },
      error => {
        // подлюченный сервес для ошибок
        MaterialService.toast(error.error.message)
        //console.warn(error)
        // если ошибка влючаем форму
        this.form.enable()
      }
    )
  }

}
