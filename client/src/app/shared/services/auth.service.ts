import {inject, Injectable} from "@angular/core";
import {AuthToken, Login} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private http = inject(HttpClient)

  private token = null
  private status = null

  login(login: Login): Observable<AuthToken> {
    return this.http.post<AuthToken>('api/auth/login', login)
      .pipe(
        tap((authToken) => {
          this.setToken(authToken.token)
          localStorage.setItem('auth-token', authToken.token)
        })
      )
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('auth-token')) {
      this.setToken(localStorage.getItem('auth-token'))
    }
    return !!this.token
  }

  logout() {
    this.setToken(null)
    localStorage.clear()
  }

  setStatus(status: number) {
    this.status = status
  }

  // getStatus() {
  //   return this.status
  // }

}
