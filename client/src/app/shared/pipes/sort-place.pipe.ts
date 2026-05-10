import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sortPlace',
  standalone: true
})
export class SortPlacePipe implements PipeTransform {

  transform(typePlace: string): string {
    let place = ''

    switch (typePlace) {
      case 'restaurant':
        place = 'Ресторан';
        break;
      case 'сafe':
        place = 'Кафе';
        break;
      case 'other':
        place = 'Другое';
        break;
      default:
        place = ''
    }
    return place;
  }
}
