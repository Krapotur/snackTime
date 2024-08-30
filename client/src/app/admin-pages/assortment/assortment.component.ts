import { Component } from '@angular/core';
import {CategoriesPageComponent} from "../categories-page/categories-page.component";

@Component({
  selector: 'app-assortment',
  standalone: true,
    imports: [
        CategoriesPageComponent
    ],
  templateUrl: './assortment.component.html',
  styleUrl: './assortment.component.scss'
})
export class AssortmentComponent {

}
