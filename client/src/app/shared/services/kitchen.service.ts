import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Kitchen} from "../interfaces";

@Injectable({
  providedIn: "root"
})

export class KitchenService {

  constructor(private http: HttpClient) {
  }

  getKitchens(): Observable<Kitchen[]> {
    return this.http.get<Kitchen[]>('/api/kitchen')
  }

}
