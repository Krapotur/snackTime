import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Restaurant} from "../interfaces";


@Injectable({
  providedIn: "root"
})

export class RestaurantService {
  private http = inject(HttpClient)

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('/api/restaurants')
  }

  getRestaurantByID(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`/api/restaurants/${id}`)
  }

  create(fd?: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/restaurants', fd)
  }

  update(fd: FormData, restaurant?: Restaurant, id?: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/restaurants/${id}`, fd ? fd : restaurant)
  }

}
