import {Injectable} from "@angular/core";
import {AuthToken, Login} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable } from "rxjs";
import { tap} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(login: Login): Observable<AuthToken> {
    return this.http.post<AuthToken>('api/auth/login', login)
      // .pipe(
      //   tap((authToken) => {
      //     console.log(authToken)
      //     // this.setToken(authToken.token)
      //     // localStorage.setItem('auth-token', authToken.token)
      //     // localStorage['user'] = JSON.stringify(authToken)
      //     // localStorage.setItem('post', authToken.post)
      //   })
      // )
  }

  logout(){

  }
}
