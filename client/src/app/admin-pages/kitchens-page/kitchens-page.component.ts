import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SortPlacePipe} from "../../shared/pipes/sort-place.pipe";
import {Kitchen,} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {KitchenService} from "../../shared/services/kitchen.service";
import {MaterialService} from "../../shared/classes/material.service";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {EmptyComponent} from "../../shared/components/empty/empty.component";
import {LoaderComponent} from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-kitchens-page',
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
    LoaderComponent
  ],
  templateUrl: './kitchens-page.component.html',
  styleUrls: ['./kitchens-page.component.scss', '../../shared/styles/style-table.scss']
})
export class KitchensPageComponent implements OnInit, OnDestroy {
  private router = inject(Router)
  private kitchenService = inject(KitchenService)

  kSub: Subscription
  isLoading = false
  isEmpty: boolean
  activeRoute = 'form-kitchen'
  dataSource: MatTableDataSource<Kitchen>;
  displayedColumns: string[] = ['#', 'title', 'edit', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getKitchens()
  }

  ngOnDestroy() {
    if (this.kSub) this.kSub.unsubscribe()
  }

  getKitchens() {
    let position = 1
    this.isLoading = true

    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: kitchens => {
        if (kitchens.length == 0) this.isEmpty = true
        this.isLoading = false
        kitchens.map(kitchen => kitchen.position = position++)
        this.dataSource = new MatTableDataSource<Kitchen>(kitchens)
        this.dataSource.paginator = this.paginator;
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openPage(id: string) {
    void this.router.navigate([`admin/form-kitchen/${id}`])
  }

  changeStatus(kitchen: Kitchen) {
    let newKitchen: Kitchen = {
      ...kitchen,
      status: !kitchen.status
    }

    this.kSub = this.kitchenService.update(null, newKitchen, newKitchen._id).subscribe({
      next: message => {
        MaterialService.toast(message.message);
        this.getKitchens()
      },
      error: error => MaterialService.toast(error.error.message())
    })
  }
}
