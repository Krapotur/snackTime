import { Component } from '@angular/core';
import {CategoriesPageComponent} from "../categories-page/categories-page.component";
import {PositionsPageComponent} from "../positions-page/positions-page.component";

@Component({
  selector: 'app-assortment',
  standalone: true,
  imports: [
    CategoriesPageComponent,
    PositionsPageComponent
  ],
  templateUrl: './assortment.component.html',
  styleUrl: './assortment.component.scss'
})
export class AssortmentComponent {

}
