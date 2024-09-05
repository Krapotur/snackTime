import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MaterialService} from "../../classes/material.service";
import {GroupService} from "../../services/group.service";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../services/restaurant.service";

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
  private groupService = inject(GroupService)
  private restaurantService = inject(RestaurantService)
  private router = inject(Router)

  isAdmin: boolean
  gSub: Subscription
  rSub: Subscription
  userName = ''
  restaurantTitle = ''

  ngOnInit() {
    this.getGroupById()
    this.getRestaurantByUser()
  }

  ngOnDestroy() {
    if (this.gSub) this.gSub.unsubscribe()
    if (this.rSub) this.rSub.unsubscribe()
  }

  getGroupById() {
    let profile = JSON.parse(localStorage.getItem('profile'))
    this.gSub = this.groupService.getGroupByID(profile.group).subscribe({
      next: group => this.isAdmin =  group.alias === 'administrator',
      error: error => MaterialService.toast(error.error.error)
    })
  }

  getRestaurantByUser(){
    let profile
    if (localStorage.getItem('profile')) {
      profile = JSON.parse(localStorage.getItem('profile'))
    }
    this.getRestaurantById(profile['rest'])
    this.userName = profile['userName']
  }

  getRestaurantById(id: string){
    if (id){
      this.rSub = this.restaurantService.getRestaurantByID(id).subscribe({
        next: rest => this.restaurantTitle = rest.title,
        error: e => MaterialService.toast(e.error.message)
      })
    }
  }

  logout() {
    this.authService.logout()
    void this.router.navigate(['/login'])
  }
}
