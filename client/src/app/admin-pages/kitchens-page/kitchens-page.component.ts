import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import { MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SortPlacePipe} from "../../shared/pipes/sort-place.pipe";
import {Kitchen, } from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {KitchenService} from "../../shared/services/kitchen.service";
import {MaterialService} from "../../shared/classes/material.service";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

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
        SortPlacePipe
    ],
  templateUrl: './kitchens-page.component.html',
  styleUrls: ['./kitchens-page.component.scss','../../shared/styles/style-table.scss']
})
export class KitchensPageComponent implements OnInit{

  constructor(private kitchenService: KitchenService){}

  kSub: Subscription
  dataSource: MatTableDataSource<Kitchen>;
  displayedColumns: string[] = ['#', 'title','edit', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getKitchens()
  }

  getKitchens(){
    let position = 1

    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: kitchens => {
        kitchens.map(kitchen => kitchen.position = position++)
        this.dataSource = new MatTableDataSource<Kitchen>(kitchens)
        this.dataSource.paginator = this.paginator;
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openPage(_id: string) {

  }

  changeStatus(kitchen: Kitchen) {

  }
}
