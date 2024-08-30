import { Component } from '@angular/core';
import {CategoriesPageComponent} from "../categories-page/categories-page.component";

@Component({
  selector: 'app-positions-page',
  standalone: true,
  imports: [
    CategoriesPageComponent
  ],
  templateUrl: './positions-page.component.html',
  styleUrls: ['./positions-page.component.scss', '../../shared/styles/style-table.scss']
})
export class PositionsPageComponent {

}
