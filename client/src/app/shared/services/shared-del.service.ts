import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Elem} from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class SharedDelService {
  constructor(private http: HttpClient) {
  }
  delete(elem: Elem): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/${elem.formRoute.includes('kitchen') ?
                                                            'kitchens' : elem.route}/${elem.id}`)
  }
}