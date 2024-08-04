import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss'
})
export class SiteLayoutComponent {

 constructor(private authService: AuthService,
             private router: Router) {
 }
  logout() {
    this.authService.logout()
    this.router.navigate(['/login']).then()
  }
}
