import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    RouterLinkActive,
    MatProgressBar
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss'
})
export class SiteLayoutComponent implements OnInit {
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private router = inject(Router)

  isAdmin: boolean

  ngOnInit() {
    this.isAdmin = this.userService.getGroup() == 'administrator'
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login']).then()
  }
}
