import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sortPlace',
  standalone: true
})
export class SortPlacePipe implements PipeTransform {
  constructor() {
  }
  transform(typePlace: string): string {
    console.log(typePlace)
    let place = ''

    switch (typePlace) {
      case 'restaurant':
        place = 'Ресторан';
        break;
      case 'сafe':
        place = 'Кафе';
        break;
      default:
        place = ''
    }
    return place;
  }
}
