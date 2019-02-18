import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.servisec';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.services';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
//AfterViewInit - когда зарендерен компонент в дом дерево
export class SiteLayoutComponent implements OnInit, AfterViewInit {
  // забираем опреденный элемент из компонета через дикоратор
  //floatingRef - перемещяем в переменную которая имеет специальный тип
  @ViewChild('floating') floatingRef: ElementRef
  // динамический вывод массива сылок в меню

  links = [
    {url: '/overview', name: 'Обзор'},
    {url: '/analytics', name: 'Аналитика'},
    {url: '/history', name: 'История'},
    {url: '/order', name: 'Добавление заказа'},
    {url: '/categories', name: 'Ассортимент'},
  ]

  // добавляем сервесы инжектируем
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }
  // время жизни
  ngAfterViewInit(){
    // инициализируем флоут кнопку
    // передаем референцию
    MaterialService.initializeFloatingButton(this.floatingRef)
  }
  // метод выхода
  logout(event: Event) {
    // отменяем стандартное поведение евента который мы прередали по сылке тоесть перезагрузка страницы #
    event.preventDefault()
    // очищяем сессию
    this.auth.logaut()
    this.router.navigate(['/login'])
  }

}
