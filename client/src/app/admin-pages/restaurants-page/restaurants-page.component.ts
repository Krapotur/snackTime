import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Kitchen, Restaurant} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {MaterialService} from "../../shared/classes/material.service";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import { Router, RouterLink} from "@angular/router";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {EmptyComponent} from "../../shared/components/empty/empty.component";
import {KitchenService} from "../../shared/services/kitchen.service";
import {FilterKitchenPipe} from "../../shared/pipes/filter-kitchen.pipe";
import {SortPlacePipe} from "../../shared/pipes/sort-place.pipe";
import {KitchensPageComponent} from "../kitchens-page/kitchens-page.component";

@Component({
  selector: 'app-restaurants-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NgIf,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    MatSlideToggleModule,
    NgOptimizedImage,
    LoaderComponent,
    EmptyComponent,
    FilterKitchenPipe,
    SortPlacePipe,
    KitchensPageComponent
  ],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.scss', '../../shared/styles/style-table.scss']
})
export class RestaurantsPageComponent implements OnInit, OnDestroy {
  private restaurantService = inject(RestaurantService)
  private kitchenService = inject(KitchenService)
  private router = inject(Router)

  kitchens: Kitchen[]
  isLoading = false
  isShowTemplate = false;
  isEmpty: boolean
  activeRoute = 'form-restaurant'
  dataSource: MatTableDataSource<Restaurant>;
  displayedColumns: string[] = ['#', 'title', 'kitchen', 'rating', 'workTime', 'edit', 'status'];
  rSub: Subscription
  kSub: Subscription

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getRestaurants()
    this.getKitchens()
  }

  ngOnDestroy() {
    if (this.rSub) this.rSub.unsubscribe()
    if (this.kSub) this.kSub.unsubscribe()
  }

  getRestaurants() {
    this.isLoading = true
    let position = 1

    setTimeout(() => {
      this.rSub = this.restaurantService.getRestaurants().subscribe({
          next: restaurants => {
            if (restaurants.length == 0) this.isEmpty = true
            this.isLoading = false
            restaurants.map(restaurant => restaurant.position = position++)
            this.dataSource = new MatTableDataSource<Restaurant>(restaurants)
            // this.paginator._intl.itemsPerPageLabel = 'Количество позиций';
            this.dataSource.paginator = this.paginator;
          },
          error: error => {
            if (error.status === 401) {
              MaterialService.toast('Для получения данных, требуется авторизация!')
            } else {
              MaterialService.toast(error.error.message)
            }
          }
        }
      )
    }, 300)
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: kitchens => this.kitchens = kitchens,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openPage(id: string) {
    void this.router.navigate([`admin/form-restaurant/${id}`])
  }

  changeStatus(restaurant: Restaurant) {
    let newRestaurant: Restaurant = {
      ...restaurant,
      status: !restaurant.status,
    }

    this.restaurantService.update(null,newRestaurant, newRestaurant._id).subscribe({
      next: message => {
        MaterialService.toast(message.message);
        this.getRestaurants()
      },
      error: error => MaterialService.toast(error.error.error)
    })
  }
}
