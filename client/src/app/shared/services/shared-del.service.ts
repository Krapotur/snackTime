import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Elem } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SharedDelService {
  private http = inject(HttpClient);
  private sharedData = new BehaviorSubject<boolean>(false);
  sharedData$ = this.sharedData.asObservable();

  updateData(isDelete: boolean) {
    this.sharedData.next(isDelete);
  }

  getCurrentValue(): boolean {
    return this.sharedData.value;
  }

  delete(elem: Elem): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `/api/${elem.formRoute}/${elem.id}`,
    );
  }
}
