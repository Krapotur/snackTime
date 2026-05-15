import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../shared/services/category.service';
import { Subscription } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { UserService } from '../../shared/services/user.service';
import { PromoService } from '../../shared/services/promo.service';
import { KitchenService } from '../../shared/services/kitchen.service';
import { PositionService } from '../../shared/services/position.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private restaurantService = inject(RestaurantService);
  private userService = inject(UserService);
  private promoService = inject(PromoService);
  private kitchenService = inject(KitchenService);
  private categoryService = inject(CategoryService);
  private positionsService = inject(PositionService);

  quantityRestaurants = 0;
  quantityUsers = 0;
  quantityPromos = 0;
  quantityKitchens = 0;
  quantityCategories = 0;
  quantityPositions = 0;

  rSub: Subscription;
  uSub: Subscription;
  prSub: Subscription;
  kSub: Subscription;
  cSub: Subscription;
  pSub: Subscription;

  ngOnInit(): void {
    this.getQuantityRestaurants();
    this.getQuantityUsers();
    this.getQuantityPromos();
    this.getQuantityKitchens();
    this.getSQuantityCategories();
    this.getQuantityPositions();
  }

  ngOnDestroy(): void {
    this.rSub?.unsubscribe();
    this.uSub?.unsubscribe();
    this.prSub?.unsubscribe();
    this.kSub?.unsubscribe();
    this.cSub?.unsubscribe();
    this.pSub?.unsubscribe();
  }

  getQuantityRestaurants() {
    this.cSub = this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => (this.quantityRestaurants = restaurants.length),
      error: () =>
        MaterialService.toast('Не удалось получить количество ресторанов'),
    });
  }

  getQuantityPromos() {
    this.prSub = this.promoService.getPromos().subscribe({
      next: (promos) => (this.quantityPromos = promos.length),
      error: () =>
        MaterialService.toast('Не удалось получить количество реклам'),
    });
  }

  getQuantityUsers() {
    this.uSub = this.userService.getUsers().subscribe({
      next: (users) => (this.quantityUsers = users.length),
      error: () =>
        MaterialService.toast('Не удалось получить количество пользователей'),
    });
  }

  getQuantityKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: (kitchens) => (this.quantityKitchens = kitchens.length),
      error: () =>
        MaterialService.toast('Не удалось получить количество кухонь'),
    });
  }
  
  getSQuantityCategories() {
    this.cSub = this.categoryService.getCategories().subscribe({
      next: (categories) => (this.quantityCategories = categories.length),
      error: () =>
        MaterialService.toast('Не удалось получить количество категорий'),
    });
  }
  getQuantityPositions() {
    this.pSub = this.positionsService.getPositions().subscribe({
      next: (positions) => (this.quantityPositions = positions.length),
      error: () =>
        MaterialService.toast('Не удалось получить количество блюд'),
    });
  }
}
