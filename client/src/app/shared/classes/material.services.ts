import { ElementRef } from '@angular/core';

declare var M
// для понимаения класса M который унас еподключен

// интерфес для модального окна
export interface MaterialInstance {
  open?(): void
  close?(): void
  destroy?(): void
}

// интерфейс для дата пикера
export interface MaterialDatepicker extends MaterialInstance {
  date?: Date
}


// создаем класс который работает с различными сущностями которые есть в библеотеке материал дизайн
export class MaterialService {
  static toast(message: string) {
    // будем сообщение выводит на экран
    M.toast({
      html: message
    })
  }

  // ждем рефененцию
  static initializeFloatingButton(ref: ElementRef) {

    //ref.nativeElement - в рефенеции лежит элемент который нужен материал дизайну
    M.FloatingActionButton.init(ref.nativeElement)
  }
  // добавляем фокус на импуты
  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(ref: ElementRef): MaterialInstance  {
    // инициализируем модальное окно
    return M.Modal.init(ref.nativeElement)
  }

  static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  // метод для инициализации даты
  static initDatepicker(ref: ElementRef, onClose: () => void ): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    })
  }
// для открываеющийся вкладке информация на овервью
  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement)
  }
}
