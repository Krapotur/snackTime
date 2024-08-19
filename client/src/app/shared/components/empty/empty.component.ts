import {Component, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './empty.component.html',
  styleUrl: './empty.component.scss'
})
export class EmptyComponent implements OnInit{

  constructor(private router: Router) {
  }
  element = ''
  @Input() page: string = ''

  ngOnInit() {
    if(this.page === 'form-restaurant') this.element = 'ресторан'
    if(this.page === 'form-user') this.element = 'пользователя'
    if(this.page === 'form-kitchen') this.element = 'кухню'
  }

  navigateToFormPage() {
    this.router.navigate([`admin/${this.page}`]).then()
  }
}
