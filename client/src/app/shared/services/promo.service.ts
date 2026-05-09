import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Promo } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PromoService {
  private http = inject(HttpClient);

  getPromos(restaurantID?: string): Observable<Promo[]> {
    if (restaurantID) {
      return this.http.get<Promo[]>(`/api/promos?restaurantID=${restaurantID}`);
    }

    return this.http.get<Promo[]>('/api/promos');
  }

  getPromoByID(id: string): Observable<Promo> {
    return this.http.get<Promo>(`/api/promos/${id}`);
  }

  create(fd?: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/promos', fd);
  }

  update(fd: FormData, promo?: Promo, id?: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/promos/${id}`, fd ? fd : promo);
  }
}
