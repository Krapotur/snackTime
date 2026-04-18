import { Pipe, PipeTransform } from '@angular/core';
import { Restaurant } from '../interfaces';

@Pipe({
  name: 'filterRestaurant',
  standalone: true
})
export class FilterRestaurantPipe implements PipeTransform {
  transform(
    restaurantID: string | { _id?: string } | null | undefined,
    restaurants: Restaurant[] | null | undefined,
  ): string {
    if (!restaurantID || !restaurants?.length) return '';

    // Sometimes backend may return populated object instead of id.
    if (typeof restaurantID === 'object') {
      return restaurantID?._id
        ? restaurants.find((r) => r._id === restaurantID._id)?.title || ''
        : '';
    }

    return restaurants.find((restaurant) => restaurant._id === restaurantID)?.title || '';
  }
}
