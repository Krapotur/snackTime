import { inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuthToken, Login } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { SharedService } from './shared.service';
import { GroupService } from './group.service';
import { MaterialService } from '../classes/material.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit, OnDestroy {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.gSub?.unsubscribe()
  }

  private http = inject(HttpClient);
  private groupService = inject(GroupService);
  private sharedService = inject(SharedService);
  private token = null;
  private status = null;

  gSub: Subscription;

  login(login: Login): Observable<AuthToken> {
    return this.http.post<AuthToken>('api/auth/login', login).pipe(
      tap((authToken) => {
        // this.getGroupByID(authToken.group);
        console.log('AUTH',authToken.group)
        this.setToken(authToken.token);
        localStorage.setItem('auth-token', authToken.token);
        localStorage.setItem(
          'profile',
          JSON.stringify({
            userName: authToken.userName,
            group: authToken.group,
            rest: authToken.rest,
            userID: authToken.user,
          }),
        );
      }),
    );
  }

  getGroupByID(id: string) {
  this.gSub = this.groupService.getGroupByID(id).subscribe({
      next: (group) => this.sharedService.updateDataGroup(group.alias),
      error: (error) => {
        MaterialService.toast(error.error.message);
      },
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('auth-token')) {
      this.setToken(localStorage.getItem('auth-token'));
    }
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }

  setStatus(status: number) {
    this.status = status;
  }
}
