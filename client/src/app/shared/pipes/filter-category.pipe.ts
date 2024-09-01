import {Pipe, PipeTransform} from "@angular/core";
import {Category} from "../interfaces";

@Pipe({
  name: 'filterCategory',
  standalone: true
})
export class FilterCategoryPipe implements PipeTransform {
  constructor() {
  }
  transform(id: string, categories: Category[]): string {
    let title = ''

    categories.forEach(category => {
      if (id === category._id) title = category.title
    })

    return title;
  }
}
