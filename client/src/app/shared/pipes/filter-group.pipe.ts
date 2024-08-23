import {Pipe, PipeTransform} from "@angular/core";
import {Group, Kitchen} from "../interfaces";

@Pipe({
  name: 'filterGroup',
  standalone: true
})
export class FilterGroupPipe implements PipeTransform {
  constructor() {
  }
  transform(id: string, groups: Group[]): string {
    let title = ''

    groups.forEach(group => {
      if (id === group._id) title = group.title
    })

    return title;
  }
}
