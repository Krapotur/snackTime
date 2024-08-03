import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpInterceptorFn, HttpResponse,} from "@angular/common/http";
import {tap} from "rxjs";
import {Router} from "@angular/router";

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const router = inject(Router)


  if (auth.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: auth.getToken()
      }
    })
  }
  return next(req).pipe(
    tap(
      (event: HttpResponse<any>) => ()=>{
        auth.setStatus(event.status)
      },
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          router.navigate(['/login'], {
            queryParams: {
              sessionFailed: true
            }
          }).then()
        }

        auth.setStatus(error.status)
      }
    )
  )
}






