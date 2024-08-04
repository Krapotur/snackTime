import {Pipe, PipeTransform} from "@angular/core";
import {Kitchen} from "../interfaces";

@Pipe({
  name: 'filterKitchen',
  standalone: true
})
export class FilterUsersPipe implements PipeTransform {
  constructor() {
  }
  transform(kitchenID: string, kitchens: Kitchen[]): string {
    let title = ''

    kitchens.forEach(kitchen => {
      if (kitchenID === kitchen._id) title = kitchen.title
    })
    return title;
  }
}
