import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sortPlace',
  standalone: true
})
export class SortPlacePipe implements PipeTransform {

  transform(typePlace: string): string {
    console.log('sort-place-pipe', typePlace)
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
