import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Position} from "../interfaces";

@Injectable({
  providedIn: "root"
})

export class PositionService {
  private http = inject(HttpClient)

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>('/api/positions')
  }

  getPositionByID(id: string): Observable<Position> {
    return this.http.get<Position>(`/api/positions/${id}`)
  }

  getPositionsByCategoryID(id: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/positions/category/${id}`)
  }


  create(fd: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/positions', fd)
  }

  update(fd: FormData, position?: Position, id?: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/positions/${id}`, fd ? fd : position)
  }

}
