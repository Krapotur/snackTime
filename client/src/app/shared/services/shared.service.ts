import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Elem } from '../interfaces';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private http = inject(HttpClient);
  private sharedDataDel = new BehaviorSubject<boolean>(false);
  private sharedDataGroup = new BehaviorSubject<string>('');
  sharedData$ = this.sharedDataDel.asObservable();
  sharedDataGroup$ = this.sharedDataGroup.asObservable();

  updateDataDel(isDelete: boolean) {
    this.sharedDataDel.next(isDelete);
  }

  getCurrentDelValue(): boolean {
    return this.sharedDataDel.value;
  }

  updateDataGroup(group: string) {
    this.sharedDataGroup.next(group);
  }

  getCurrentGroupValue(): string {
    return this.sharedDataGroup.value;
  }

  delete(elem: Elem): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `/api/${elem.formRoute}/${elem.id}`,
    );
  }
}
