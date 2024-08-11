import {Pipe, PipeTransform} from "@angular/core";
import {Kitchen} from "../interfaces";

@Pipe({
  name: 'sortPlace',
  standalone: true
})
export class SortPlacePipe implements PipeTransform {
  constructor() {
  }
  transform(typePlace: string): string {
    let place = ''

    switch (typePlace) {
      case 'restaurant':
        place = 'Ресторан';
        break;
      case 'сafe':
        place = 'Кафе';
        break;
      default:
        place = 'Другое'
    }
    return place;
  }
}
