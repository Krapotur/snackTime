import {Component, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {CategoryRoute} from "../../interfaces";

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss'
})
export class EmptyComponent implements OnInit {

  constructor(private router: Router) {
  }

  element = ''
  @Input() page: string
  @Input() routeCategory: CategoryRoute

  ngOnInit() {
    if (this.page === 'form-restaurant') this.element = 'ресторан'
    if (this.page === 'form-user') this.element = 'пользователя'
    if (this.page === 'form-kitchen') this.element = 'кухню'
  }

  navigateToFormPage() {
    let routeCat = this.routeCategory ? this.routeCategory : null
    if (routeCat) {
      void this.router.navigate([`st/${routeCat.route}`], {
        queryParams: {
          category: routeCat.id
        }
      })
    } else void this.router.navigate([`st/${this.page}`])
  }
}
