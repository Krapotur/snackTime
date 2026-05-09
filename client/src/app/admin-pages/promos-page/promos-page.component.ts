import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgIf } from '@angular/common';
import { Promo } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { PromoService } from '../../shared/services/promo.service';
import { MaterialService } from '../../shared/classes/material.service';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EmptyComponent } from '../../shared/components/empty/empty.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-promos-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NgIf,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatSlideToggleModule,
    LoaderComponent,
    EmptyComponent,
  ],
  templateUrl: './promos-page.component.html',
  styleUrls: ['./promos-page.component.scss', '../../shared/styles/style-table.scss'],
})
export class PromosPageComponent implements OnInit, OnDestroy {
  private promoService = inject(PromoService);
  private sharedService = inject(SharedService);
  private router = inject(Router);

  quantityPromo = 0;
  isLoading = false;
  isShowTemplate = false;
  isEmpty: boolean;
  activeRoute = 'form-promo';
  dataSource: MatTableDataSource<Promo>;
  displayedColumns: string[] = ['#', 'title', 'description', 'link', 'edit', 'status'];
  pSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getPromos();
  }

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe();
  }

  getPromos() {
    this.isLoading = true;
    let position = 1;

    setTimeout(() => {
      this.pSub = this.promoService.getPromos().subscribe({
        next: (promos) => {
          let list = promos;
          const profile = JSON.parse(localStorage.getItem('profile') || '{}');
          const isAdmin =
            this.sharedService.getCurrentGroupValue() === 'administrator';

          if (!isAdmin) {
            list = promos.filter(
              (promo) => promo.restaurant === profile?.rest,
            );
          }

          this.quantityPromo = list.length;
          if (list.length === 0) this.isEmpty = true;
          this.isLoading = false;
          list.map((promo) => (promo.position = position++));
          this.dataSource = new MatTableDataSource<Promo>(list);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          if (error.status === 401) {
            MaterialService.toast('Для получения данных, требуется авторизация!');
          } else {
            MaterialService.toast(error.error.message);
          }
        },
      });
    }, 300);
  }

  openPage(id: string) {
    void this.router.navigate([`st/form-promo/${id}`]);
  }

  changeStatus(promo: Promo) {
    const newPromo: Promo = {
      ...promo,
      status: !promo.status,
    };

    this.promoService.update(null, newPromo, newPromo._id).subscribe({
      next: (message) => {
        MaterialService.toast(message.message);
        this.getPromos();
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
