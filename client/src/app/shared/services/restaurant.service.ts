import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Restaurant} from "../interfaces";


@Injectable({
  providedIn: "root"
})

export class RestaurantService {

  constructor(private http: HttpClient) {
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('/api/restaurants')
  }

  getRestaurantByID(id: string): Observable<Restaurant>{
    return this.http.get<Restaurant>(`/api/restaurants/${id}`)
  }

  create(restaurant: Restaurant, image): Observable<{ message: string }> {
    const fd = new FormData()

    if (image) fd.append('image', image, image.name)

    fd.append('title', restaurant.title)
    fd.append('description', restaurant.description)
    fd.append('kitchen', restaurant.kitchen)
    fd.append('timeOpen', restaurant.timeOpen)
    fd.append('timeClose', restaurant.timeClose)
    fd.append('typePlace', restaurant.typePlace)

    return this.http.post<{ message: string }>('/api/restaurants', fd)
  }

  update(restaurant: Restaurant, image?): Observable<{message: string}> {
    const fd = new FormData()

    if (image) fd.append('image', image, image.name)

    fd.append('title', restaurant.title)
    fd.append('description', restaurant.description)
    fd.append('kitchen', restaurant.kitchen)
    fd.append('timeOpen', restaurant.timeOpen)
    fd.append('timeClose', restaurant.timeClose)
    fd.append('typePlace', restaurant.typePlace)

    return this.http.patch<{message:string}>(`/api/restaurants/${restaurant._id}`,fd)
  }

}
