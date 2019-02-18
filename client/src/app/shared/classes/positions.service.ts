import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Position, Message } from '../interfaces';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
// сервис для работы с позициями

export class PositionsService {
  constructor (private http: HttpClient) {

  }
  // получить все позици
  fetch(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${categoryId}`)
  }
  // создать одну позицию
  create(position: Position): Observable<Position>{
    return this.http.post<Position>('/api/position', position)
  }
  // Обновить позицию
  update(position: Position): Observable<Position>{
    return this.http.patch<Position>(`/api/position/${position._id}`, position)
  }
  // удлаение позиций
  delete(position: Position): Observable<Message>{
    return this.http.delete<Message>(`/api/position/${position._id}`)
  }
}
