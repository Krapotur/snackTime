import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Restaurant, User} from "../interfaces";


@Injectable({
  providedIn: "root"
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
  }

  create(user: User, image): Observable<{ message: string }> {
    const fd = new FormData()

    if (image) fd.append('image', image, image.name)

    fd.append('lastName', user.lastName)
    fd.append('firstName', user.firstName)
    fd.append('login', user.login)
    fd.append('email', user.email)
    fd.append('phone', user.phone)
    fd.append('restaurant', user.restaurant)
    fd.append('password', user.password)

    return this.http.post<{ message: string }>('/api/users', fd)
  }

}
