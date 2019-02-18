import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { Category } from '../shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  // флаг для загрузки лоадера
  //loading = false
  //categories: Category[] = []

  //categories$  -переменная rxj стрим и евляется асинхронной
  categories$: Observable<Category[]>

  constructor(private categoriesService: CategoriesService) { }

  // при создании компонента получаем все категории
  // ngOnInit() {
  //   this.loading = true
  //   this.categoriesService.fetch().subscribe(
  //     category => {
  //       this.loading = false
  //       this.categories = category
  //       console.log('category', category)
  //     } )
  // }
  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }

}
