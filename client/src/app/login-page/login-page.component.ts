import {Component, OnDestroy, OnInit} from '@angular/core';
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
  form: FormGroup
  aSub: Subscription

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe(params => {
      if(params['registered']) {
        //Теперь вы можете войти в систему
      } else if(params['sessionFailed']) {
        MaterialService.toast('Сессия истекла, авторизуйтесь снова')
      }
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe()
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
        next: () => this.router.navigate(['/users']),
        error: error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      }
    )
  }
}
