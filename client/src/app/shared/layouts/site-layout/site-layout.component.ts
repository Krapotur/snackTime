import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MaterialService } from '../../classes/material.service';
import { GroupService } from '../../services/group.service';
import { Subscription } from 'rxjs';
import { RestaurantService } from '../../services/restaurant.service';
import { SharedService } from '../../services/shared.service';
import { Restaurant } from '../../interfaces';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, RouterLinkActive],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss',
})
export class SiteLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  private groupService = inject(GroupService);
  private restaurantService = inject(RestaurantService);

  isLoading = false;
  isAdmin: boolean;
  isLogout = false;
  gSub: Subscription;
  rSub: Subscription;
  userName: string | null = null;
  restaurant: Restaurant | null = null;

  ngOnInit() {
    this.getGroupById();
    this.getRestaurantById();
  }

  ngOnDestroy() {
    this.gSub?.unsubscribe();
    this.rSub?.unsubscribe();
  }

  getGroupById() {
    this.isLoading = true;
    let profile = JSON.parse(localStorage.getItem('profile'));
    this.userName = profile['userName'];
    this.gSub = this.groupService.getGroupByID(profile.group).subscribe({
      next: (group) => {
        this.sharedService.updateDataGroup(group.alias);
        this.isAdmin = group.alias === 'administrator';
        if (this.isAdmin) {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.router.navigate([`/st/dashboard`]);
        }
        this.isLoading = false;
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  getRestaurantById() {
    this.isLoading = true;
    let restaurantID = this.sharedService.getRestaurantID();
    this.rSub = this.restaurantService
      .getRestaurantByID(restaurantID)
      .subscribe({
        next: (r) => {
          this.restaurant = r;
          this.isLoading = false;
        },
        error: (e) => MaterialService.toast(e.error.message),
      });
  }

  logout() {
    this.isLogout = !this.isLogout;
  }

  submit() {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
