import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";
import {User} from "../shared/interfaces";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    RouterLink,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  users: User[] = []
  form: FormGroup
  aSub: Subscription
  uSub: Subscription

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe(params => {
      if (params['accessDenied']) {
        MaterialService.toast('Для начала авторизуйтесь')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Сессия истекла, авторизуйтесь снова')
      }
    })

  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe()
    if (this.uSub) this.uSub.unsubscribe()
  }

  get login() {
    return this.form.get('login')
  }

  get password() {
    return this.form.get('password')
  }

  onSubmit() {
    this.form.disable()

    this.aSub = this.authService.login(this.form.value).subscribe({
        next: () => void this.router.navigate(['/st/assortment']),
        error: error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      }
    )
  }
}
