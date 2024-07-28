import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AuthService} from "../shared/services/auth.service";
import {AuthToken, Login} from "../shared/interfaces";

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
    NgOptimizedImage
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  form: FormGroup

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  get login() {
    return this.form.get('login')
  }

  get password() {
    return this.form.get('password')
  }

  onSubmit() {
    const login: Login = {
      login: this.login.value,
      password: this.password.value
    }

    this.authService.login(login).subscribe({
        next: (authToken: AuthToken) =>
          authToken ? this.form.disable() : console.log('sss'),
        error: error => console.log('error: ' + error.error.message)
      }
    )
  }
}
