import {
  ActivatedRouteSnapshot, CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable, of} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  private auth =  inject(AuthService)
  private router=inject(Router)

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.auth.isAuthenticated()){
      return of(true)
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      }).then()
    }
    return of(false);
  }

}

export const isAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  return inject(AuthGuard).canActivate(route, state)
}
