import {inject, Injectable, OnDestroy} from "@angular/core";
import {AuthToken, Login} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable, Subscription, tap} from "rxjs";
import {UserService} from "./user.service";
import {GroupService} from "./group.service";
import {MaterialService} from "../classes/material.service";

@Injectable({
  providedIn: "root"
})

export class AuthService implements OnDestroy {
  private http = inject(HttpClient)
  private userService = inject(UserService)
  private groupService = inject(GroupService)

  gSub: Subscription

  private token = null
  private status = null

  ngOnDestroy() {
    if (this.gSub) this.gSub.unsubscribe()
  }

  login(login: Login): Observable<AuthToken> {
    return this.http.post<AuthToken>('api/auth/login', login)
      .pipe(
        tap((authToken) => {
          this.setToken(authToken.token)
          localStorage.setItem('auth-token', authToken.token)
          localStorage.setItem('profile', JSON.stringify({
            userName: authToken.userName,
            group: authToken.group
          }))
          this.getGroupById(authToken.group)
        })
      )
  }

  getGroupById(id: string){
    let profile =  JSON.parse(localStorage.getItem('profile'))

    this.gSub = this.groupService.getGroupByID(id).subscribe({
      next: group => this.userService.setGroup(group.alias),
      error: error => MaterialService.toast(error.error.error)
    })

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
}
