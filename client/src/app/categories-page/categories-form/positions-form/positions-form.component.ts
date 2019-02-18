import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/classes/positions.service';
import { Position } from '../../../shared/interfaces';
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
// AfterViewInit - вызываем метод в том случае когда загрузится контент
// OnDestroy - уничтожалась
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  // Данный компонеты ожидает парметр
  @Input('categoryId') categoryId: string
  // получаем достпук референции модального окна
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  loading = false
  modal: MaterialInstance
  form: FormGroup
  // проверка на редактировании записи или на добавление
  positionId = null

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    // debugger - Для отлова ошибок
    // debugger
    this.positionsService.fetch(this.categoryId).subscribe(
      positions => {
        this.positions = positions
        this.loading = false
      }
    )
  }

  ngOnDestroy() {
    // уничтожаем окно после закрытия копонента
    this.modal.destroy()
  }

  ngAfterViewInit() {
    // в сервес передаем референцию модального окна что бы им управлять
    this.modal = MaterialService.initModal(this.modalRef)
  }

  // открытие модального окна имеющиися позиции
  onSelectPosition(position: Position){
    // проверяем на редактировании
    this.positionId = position._id
    // метод динамически изменяет значени
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    // обновляем инпуты при редактриовании
    MaterialService.updateTextInputs()

  }
  // открыть модальное окно новое
  onAddPosition(){
    // добавление позиции
    this.positionId = null
    // метод динамически изменяет значени
    this.form.reset({
      name: '',
      cost: 1
    })
    this.modal.open()
    // обновляем инпуты при редактриовании
    MaterialService.updateTextInputs()
    this.modal.open()
    // данный метод обновляет значение формы
  }
  // закрытия окна
  onCancel(){
    this.modal.close()
  }
  // удаление позиции
  onDeletePosition(event: Event ,position: Position){
    // останавливаем погружени
    event.stopPropagation()

    const decision = window.confirm(`Удалить позицию "${position.name}" ?`);
    if(decision){
      this.positionsService.delete(position).subscribe(
        res => {
          // редактируем массив
          const idx = this.positions.findIndex( p => p._id === position._id)
          this.positions.splice(idx, 1);
          MaterialService.toast(res.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  // отправка формы
  onSubmit(){
    // отключаем форму работаем с сервером
    this.form.disable()
    const position: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    if(this.positionId) {
      position._id = this.positionId
      this.positionsService.update(position).subscribe(
        newPosition => {
          // находим позицию которую мы редактировали
          const idx = this.positions.findIndex( p => p._id === newPosition._id)
          this.positions[idx] = newPosition
          MaterialService.toast('Позиция обновленна')
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        () => {
          this.modal.close()
          this.form.enable()
          this.form.reset({name: '', cost: '1'})
        }
      )
    } else {
      // создаем позицию
      this.positionsService.create(position).subscribe(
        newPosition => {
          MaterialService.toast('Позиция создана')
          // добавляем позиции в массив для отображения
          this.positions.push(newPosition)
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        () => {
          this.modal.close()
          this.form.enable()
          this.form.reset({name: '', cost: '1'})
        }
      )
    }
  }



}
