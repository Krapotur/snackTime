import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category, Kitchen } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);


  getCategories(restaurantID?: string, groupID?: string): Observable<Category[]> {
    let params = new HttpParams().set('restaurantID', restaurantID)
      .set('groupID', groupID)

    return this.http.get<Category[]>(`/api/categories/`, {
      params: params
    });
  }

  getCategoriesByRestaurantID(id: string): Observable<Category[]> {
    return this.http.get<Category[]>(`/api/categories/restaurant/${id}`);
  }

  getCategoryByID(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/categories/${id}`);
  }

  create(fd: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/categories', fd);
  }

  update(
    fd?: FormData,
    category?: Category,
    id?: string,
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `/api/categories/${id}`,
      fd ? fd : category,
    );
  }

  updateStatus(
    fd?: FormData,
    category?: Category,
    id?: string,
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `/api/categories/update-status/${id}`,
      fd ? fd : category,
    );
  }
}
