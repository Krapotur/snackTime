import {Component, Input} from '@angular/core';
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
export class EmptyComponent {

  constructor(private router: Router) {
  }

  @Input() page: string = ''

  navigateToFormPage() {
    this.router.navigate([this.page]).then()
  }
}
