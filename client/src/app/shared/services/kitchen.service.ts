import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Kitchen} from "../interfaces";

@Injectable({
  providedIn: "root"
})

export class KitchenService {
  private http = inject(HttpClient)

  getKitchens(): Observable<Kitchen[]> {
    return this.http.get<Kitchen[]>('/api/kitchens')
  }

  getKitchenByID(id: string): Observable<Kitchen> {
    return this.http.get<Kitchen>(`/api/kitchens/${id}`)
  }


  create(fd: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/kitchens', fd)
  }

  update(fd?: FormData, kitchen?: Kitchen, id?: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/kitchens/${id}`, fd ? fd : kitchen)
  }
 
  updateStatus(fd?: FormData, kitchen?: Kitchen, id?: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/kitchens/update-status/${id}`, fd ? fd : kitchen)
  }

  delete(id: string): Observable<{ message: string }> {
      return this.http.delete<{ message: string }>(`/api/categories/${id}`)
    }
}
