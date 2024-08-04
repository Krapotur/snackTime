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
    return this.http.get<Restaurant[]>('/api/restaurant')
  }

}
