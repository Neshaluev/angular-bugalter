import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.services';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  // получаем доступк к инпуту файлов
  @ViewChild('input') inputRef: ElementRef

  image: File
  imagePreview: any = ''
  form: FormGroup
  isNew = true
  category: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }



  ngOnInit() {
    // определяем рективную форму это назание добавление позиции
    this.form = new FormGroup({
      // 1- name , valid -2
      name: new FormControl(null, Validators.required)
    })

    // по параметру юрл запроса определять добавление категории или ее редактирование , если есть айди категории значит редактировать
    // старый подкход к решению проблемы
    // this.route.params.subscribe( (params: Params) => {
    //   if (params['id']) {
    //     // мы редактируем форму
    //     this.isNew = false
    //   }
    // })

    this.form.disable()

    // делам последовательные запросы
    this.route.params
      .pipe(
        // как тольок прочитаем метод парамс мы хотим выполнить асинхронный стрим
        switchMap(
          (params: Params ) => {
            if(params['id']){
              // мы редактируем форму
              this.isNew = false
              // возвращяем новый стрим
              return this.categoriesService.getById(params['id'])
            }

            // если нету айди то возращем стрим так надо для свичмар
            return of(null)
          }
        )
      )
      // подписываемся на результирующий стрим
      .subscribe(
        (category: Category) => {
          //если категория есть
          if(category){
            this.category = category
            // динамическое изменение формы для редактирование данных
            this.form.patchValue({
              name: category.name
            })
            // достаем картинку если есть и делаем превью для стринцы
            this.imagePreview = category.imageSrc
            // ошивляем инпуты добавляем фокус
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )

  }

  // удаление категорий
  deleteCategory(){
    const decision = window.confirm(`Вы уверены, что хотите удалить категорию? ${this.category.name}`)
    if(decision){
      // удаляем категорию
      this.categoriesService.delete(this.category._id)
      .subscribe(
        (responce) => {MaterialService.toast(responce.message)},
        error => MaterialService.toast(error.error.message),
        // колбек который вызывается когда завершен стрим, редиректим с удаленной страницы
        () => this.router.navigate(['/categories'])
      )
    }
  }

  // при клике на кнопку загрузить избр стригереть инпут файл
  triggerClick(){
    // триггереим инпут по клику
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any){
    // получаем доступ к файлу который мы загрузили
    const file = event.target.files[0]
    this.image = file

    // нужно показать превью данной картинки
    const reader = new FileReader()

    // данный метод вызовится тогда когда загрузится вся картинка
    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit(){

      let obs$
      this.form.disable()

      //нужно одновременно обработать два этих стрима
      if (this.isNew){
        // create
        obs$ = this.categoriesService.create(this.form.value.name, this.image)
      } else {
        // update
        obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
      }

      obs$.subscribe(
        (category) => {
          // присвоиваем категории новыую кторую мы измененили получаем актульаные данные
          this.category = category
          MaterialService.toast('Изменения сохранены')
          this.form.enable()
        },
        error => {
          MaterialService.toast(error)
          this.form.enable()
        }
      )
  }

}
