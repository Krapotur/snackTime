import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class CheckRole {
  private router = inject(Router);
  private sharedService = inject(SharedService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(this.sharedService.getCurrentGroupValue());

    if (this.sharedService.getCurrentGroupValue() == 'administrator') {
      return of(true);
    } else {
      this.router
        .navigate(['/login'], {
          queryParams: {
            accessDenied: true,
          },
        })
        .then();
    }
    return of(false);
  }
}

export const isAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(CheckRole).canActivate(route, state);
};
