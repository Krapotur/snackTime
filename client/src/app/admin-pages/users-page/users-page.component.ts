import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {Restaurant, User} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {EmptyComponent} from "../../shared/components/empty/empty.component";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {FilterRestaurantPipe} from "../../shared/pipes/filter-restaurant";

@Component({
  selector: 'app-users-page',
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
    FilterRestaurantPipe
  ],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss', '../../shared/styles/style-table.scss']
})


export class UsersPageComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private restaurantService: RestaurantService
  ) {
  }

  isLoading = false;
  isShowTemplate = false;
  isEmpty: boolean
  activeRoute = 'new-user'
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['#', 'name', 'login', 'group', 'restaurant','phone', 'edit', 'status'];
  uSub: Subscription
  rSub: Subscription
  restaurants: Restaurant [] = []

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getRestaurants()
    this.getUsers()
  }

  ngOnDestroy() {
    if (this.uSub) this.uSub.unsubscribe()
    if (this.rSub) this.rSub.unsubscribe()
  }

  getUsers() {
    this.isLoading = true
    let position = 1

    setTimeout(() => {
      this.uSub = this.userService.getUsers().subscribe({
        next: users => {
          this.isLoading = false
          if (users.length == 0) this.isEmpty = true
          // users.filter(user => user.group != 'admin')
          users.map(user => user.position = position++)
          this.dataSource = new MatTableDataSource<User>(users)
          // this.paginator._intl.itemsPerPageLabel = 'Количество позиций';
          this.dataSource.paginator = this.paginator;
        },
        error: error => MaterialService.toast(error.error.message)
      })
    }, 500)
  }

  getRestaurants(){
    this.rSub = this.restaurantService.getRestaurants().subscribe({
      next: restaurants => this.restaurants = restaurants
    })
  }

}
