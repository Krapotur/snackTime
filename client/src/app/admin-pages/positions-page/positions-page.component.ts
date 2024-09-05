import {Component, inject, OnDestroy, OnInit, } from '@angular/core';
import {CategoriesPageComponent} from "../categories-page/categories-page.component";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {EmptyComponent} from "../../shared/components/empty/empty.component";
import {Category, Position} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {PositionService} from "../../shared/services/position.service";
import {FilterRestaurantPipe} from "../../shared/pipes/filter-restaurant";
import {CategoryService} from "../../shared/services/category.service";

@Component({
  selector: 'app-positions-page',
  standalone: true,
  imports: [
    CategoriesPageComponent,
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
    FilterRestaurantPipe,
  ],
  templateUrl: './positions-page.component.html',
  styleUrls: ['../../shared/styles/style-table.scss', './positions-page.component.scss']
})
export class PositionsPageComponent implements OnInit, OnDestroy {
  private positionService = inject(PositionService)
  private categoryService = inject(CategoryService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  category: Category
  categoryTitle: string
  position: Position
  positions: Position[] = []
  isLoading = false
  isShowTemplate = false;
  isEmpty: boolean
  activeRoute = 'form-position'
  dataSource: MatTableDataSource<Position>;
  displayedColumns: string[] = ['#', 'title', 'price', 'weight', 'proteins', 'fats', 'carbs', 'caloric', 'edit', 'status'];
  rSub: Subscription
  cSub: Subscription
  pSub: Subscription

  ngOnInit() {
    this.getCategoryById()
  }

  ngOnDestroy() {
    if (this.rSub) this.rSub.unsubscribe()
    if (this.pSub) this.pSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
  }

  getPositionsCategoryByID(id: string) {
    this.isLoading = true
    let positionNum = 1
    let profile = JSON.parse(localStorage.getItem('profile'))
    this.pSub = this.positionService.getPositionsByCategoryID(id).subscribe({
      next: positions => {
        this.positions = positions.filter(position => position.restaurant === profile['rest'])
        if (this.positions.length == 0) this.isEmpty = true
        this.isLoading = false
        positions.map(position => position.positionNum = positionNum++)
        this.dataSource = new MatTableDataSource<Position>(this.positions)
      },
      error: error => {
        if (error.status === 401) {
          MaterialService.toast('Для получения данных, требуется авторизация!')
        } else {
          MaterialService.toast(error.error.message)
        }

      }
    })
  }
  openPage(id?: string) {
    if (id) {
      void this.router.navigate([`st/form-position/${id}`])
    } else {
      void this.router.navigate(['st/form-position'], {
        queryParams: {
          category: this.category._id
        }
      })
    }
  }

  changeStatus(position: Position) {
    let newPosition: Position = {
      ...position,
      status: !position.status,
    }

    this.positionService.update(null, newPosition, newPosition._id).subscribe({
      next: message => MaterialService.toast(message.message),
      error:
        error => MaterialService.toast(error.error.error)
    })
  }

  getCategoryById() {
    this.route.queryParams.subscribe(params => {
      this.cSub = this.categoryService.getCategoryByID(params['category']).subscribe({
        next: category => {
          this.category = category
          this.categoryTitle = category.title
          this.getPositionsCategoryByID(params['category'])
        },
        error: error => MaterialService.toast(error.error.error)
      })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCategoriesPage() {
    void this.router.navigate(['st/assortment'])
  }
}
