import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {UserService} from "../../services/user.service";
import {MaterialService} from "../../classes/material.service";
import {GroupService} from "../../services/group.service";
import {Subscription} from "rxjs";

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
export class SiteLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private groupService = inject(GroupService)
  private router = inject(Router)

  isAdmin: boolean
  gSub: Subscription

  ngOnInit() {
    this.getGroupById()
  }

  ngOnDestroy() {
    if (this.gSub) this.gSub.unsubscribe()
  }

  getGroupById() {
    let profile = JSON.parse(localStorage.getItem('profile'))
    this.gSub = this.groupService.getGroupByID(profile.group).subscribe({
      next: group => this.isAdmin =  group.alias === 'administrator',
      error: error => MaterialService.toast(error.error.error)
    })
  }

  logout() {
    this.authService.logout()
    void this.router.navigate(['/login'])
  }
}
