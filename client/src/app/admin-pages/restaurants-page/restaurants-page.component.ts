import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Restaurant} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {MaterialService} from "../../shared/classes/material.service";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {EmptyComponent} from "../../shared/components/empty/empty.component";

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
    EmptyComponent
  ],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.scss', '../../shared/styles/style-table.scss']
})
export class RestaurantsPageComponent implements OnInit, OnDestroy {

  constructor(private restaurantService: RestaurantService,
              private router: Router
  ) {
  }

  isLoading = false
  isShowTemplate = false;
  isEmpty: boolean
  activeRoute = 'new-restaurant'
  dataSource: MatTableDataSource<Restaurant>;
  displayedColumns: string[] = ['#', 'title', 'kitchen', 'rating', 'workTime', 'edit', 'status'];
  rSub: Subscription

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getRestaurants()
  }

  ngOnDestroy() {
    if (this.rSub) this.rSub.unsubscribe()
  }

  getRestaurants() {
    this.isLoading = true
    setTimeout(() => {
      this.rSub = this.restaurantService.getRestaurants().subscribe({
          next: restaurants => {
            if (restaurants.length == 0) this.isEmpty = true
            this.isLoading = false
            this.dataSource = new MatTableDataSource<Restaurant>(restaurants)
            this.paginator._intl.itemsPerPageLabel = 'Количество позиций';
            this.dataSource.paginator = this.paginator;
          },
          error: error => MaterialService.toast(error.error.message)
        }
      )
    }, 500)
  }
}
