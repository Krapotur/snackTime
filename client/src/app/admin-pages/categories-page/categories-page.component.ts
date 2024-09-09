import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EmptyComponent} from "../../shared/components/empty/empty.component";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {Category} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {SortPlacePipe} from "../../shared/pipes/sort-place.pipe";
import {CategoryService} from "../../shared/services/category.service";
import {UserService} from "../../shared/services/user.service";
import {GroupService} from "../../shared/services/group.service";

@Component({
  selector: 'app-categories-page',
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
    RouterLink,
    SortPlacePipe,
    EmptyComponent,
    LoaderComponent,
    NgForOf
  ],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss', '../../shared/styles/style-table.scss']
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  private router = inject(Router)
  private categoryService = inject(CategoryService)
  private groupService = inject(GroupService)

  profile = {}
  categories: Category[] = []
  isLoading = false
  isEmpty: boolean
  isAdmin :boolean
  activeRoute = 'form-category'
  dataSource: MatTableDataSource<Category>;
  displayedColumns: string[] = ['#', 'title', 'edit', 'status'];
  cSub: Subscription
  gSub: Subscription

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getGroupById()
    this.getCategories()
  }

  ngOnDestroy() {
    if (this.cSub) this.cSub.unsubscribe()
    if (this.gSub) this.gSub.unsubscribe()
  }

  getCategories() {
    let position = 1
    this.isLoading = true

    this.cSub = this.categoryService.getCategories().subscribe({
      next: categories => {
        if (categories.length == 0) this.isEmpty = true
        this.isLoading = false
        this.categories = categories
        categories.map(category => category.position = position++)
        this.dataSource = new MatTableDataSource<Category>(categories)
        this.dataSource.paginator = this.paginator;
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openPage(id: string) {
    void this.router.navigate([`st/form-category/${id}`])
  }

  changeStatus(category: Category) {
    let newCategory: Category = {
      ...category,
      status: !category.status
    }

    this.cSub = this.categoryService.update(null, newCategory, newCategory._id).subscribe({
      next: message => {
        MaterialService.toast(message.message);
        this.getCategories()
      },
      error: error => MaterialService.toast(error.error.message())
    })
  }

  openPositions(id: string) {
    void this.router.navigate(['st/positions'], {
      queryParams: {
        category: id
      }
    })
  }

  getGroupById() {
    let profile = JSON.parse(localStorage.getItem('profile'))
    this.gSub = this.groupService.getGroupByID(profile.group).subscribe({
      next: group => this.isAdmin = group.alias === 'administrator',
      error: error => MaterialService.toast(error.error.error)
    })
  }
}
