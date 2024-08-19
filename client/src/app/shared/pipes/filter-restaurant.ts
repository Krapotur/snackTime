import {Pipe, PipeTransform} from '@angular/core';
import {Restaurant} from "../interfaces";

@Pipe({
  name: 'filterRestaurant',
  standalone: true
})
export class FilterRestaurantPipe implements PipeTransform {
  constructor() {
  }

  transform(restaurantID: string, restaurants: Restaurant[]): string {
    let title = ''

    restaurants.forEach(restaurant => {
      if (restaurantID === restaurant._id) title = restaurant.title
    })

    return title;
  }
}
