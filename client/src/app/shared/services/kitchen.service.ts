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
    return this.http.get<Kitchen[]>('/api/kitchens')
  }

  getKitchenByID(id: string): Observable<Kitchen> {
    return this.http.get<Kitchen>(`/api/kitchens/${id}`)
  }


  create(kitchen: Kitchen, image): Observable<{ message: string }> {
    const fd = new FormData()

    if (image) fd.append('image', image, image.name)
    fd.append('title', kitchen.title)

    return this.http.post<{ message: string }>('/api/kitchens', fd)
  }

  update(kitchen: Kitchen, image?): Observable<{ message: string }> {
    const fd = new FormData()

    fd.append('title', kitchen.title)
    if (image) fd.append('image', image, image.name)
    if (kitchen.status != null) {
      fd.append('status', kitchen.status.toString())
    }

    return this.http.patch<{ message: string }>(`/api/kitchens/${kitchen._id}`, fd)
  }

}
