import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces";


@Injectable({
  providedIn: "root"
})

export class UserService {
  private http = inject(HttpClient)
  private group = ''

  setGroup(group: string){
    this.group = group
  }

  getGroup(){
    return this.group
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
  }

  getUserByID(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`)
  }

  create(fd: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/users', fd)
  }

  update(fd: FormData, user?: User, id?: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/users/${id}`, fd ? fd : user)
  }

}
