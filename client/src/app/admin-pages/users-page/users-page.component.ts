import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {UserService} from "../../shared/services/user.service";
import {Subscription} from "rxjs";
import {User} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {LoaderComponent} from "../../shared/components/loader/loader.component";

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
    LoaderComponent
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})


export class UsersPageComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService
  ) {
  }

  isLoading = false;
  isShowTemplate = false;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['#', 'name', 'login', 'group', 'phone', 'edit', 'status'];
  uSub: Subscription

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getUsers()
  }

  ngOnDestroy() {
    if (this.uSub) this.uSub.unsubscribe()
  }

  getUsers() {
    this.isLoading = true
    let position = 1

    setTimeout(() => {
      this.uSub = this.userService.getUsers().subscribe({
        next: users => {
          this.isLoading = false
          // users.filter(user => user.group != 'admin')
          users.map(user => user.position = position++)
          this.dataSource = new MatTableDataSource<User>(users)
          this.paginator._intl.itemsPerPageLabel = 'Количество позиций';
          this.dataSource.paginator = this.paginator;
        },
        error: error => MaterialService.toast(error.error.message)
      })
    }, 500)
  }
}
