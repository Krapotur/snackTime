import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Elem, Kitchen, Restaurant } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { KitchenService } from '../../shared/services/kitchen.service';
import { MaterialService } from '../../shared/classes/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { FilterKitchenPipe } from '../../shared/pipes/filter-kitchen.pipe';
import { DeleteTemplateComponent } from '../../shared/components/delete-template/delete-template.component';
import { SortPlacePipe } from '../../shared/pipes/sort-place.pipe';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    NgClass,
    FilterKitchenPipe,
    SortPlacePipe,
    DeleteTemplateComponent,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: [
    './restaurant-form.component.scss',
    '../../shared/styles/style-form.scss',
  ],
})
export class RestaurantFormComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sharedService = inject(SharedService);
  private kitchenService = inject(KitchenService);
  private restaurantService = inject(RestaurantService);
  private router = inject(Router);

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(100),
    ]),
    timeOpen: new FormControl(0, Validators.required),
    timeClose: new FormControl(0, Validators.required),
    kitchen: new FormControl(null, Validators.required),
    image: new FormControl(
      null,
      this.route.snapshot.params['id'] ? [] : Validators.required,
    ),
  });
  kSub: Subscription;
  rSub: Subscription;
  restaurantID: string;
  kitchens: Kitchen[] = [];
  restaurants: Restaurant[];
  restaurant: Restaurant;
  elem: Elem;
  uploadedImgFile = signal<File | null>(null);
  uploadedImgLink = signal(null);
  imageUrl: string | null = null;
  isError = false;
  isDelete = false;
  sortPlaces = ['Ресторан', 'Кафе', 'Выпечка', 'Другое'];

  hours = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.restaurantID = this.route.snapshot.params['id'];
      this.getRestaurantById();
    }

    this.getKitchens();
    this.getRestaurants();

    this.sharedService.sharedData$.subscribe((x) => {
      this.isDelete = x;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    this.kSub?.unsubscribe();
    this.rSub?.unsubscribe();
  }

  uploadImg($event: any) {
    this.uploadedImgFile.set($event.target.files[0]);
    this.uploadedImgLink.set(URL.createObjectURL($event.target.files[0]));
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: (kitchens) => (this.kitchens = kitchens),
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  getRestaurants() {
    setTimeout(() => {
      this.rSub = this.restaurantService.getRestaurants().subscribe({
        next: (restaurants) => (this.restaurants = restaurants),
        error: (error) => MaterialService.toast(error.error.message),
      });
    }, 500);
  }

  getRestaurantById() {
    this.restaurantService.getRestaurantByID(this.restaurantID).subscribe({
      next: (restaurant) => {
        this.elem = {
          id: restaurant._id,
          title: restaurant.title,
          route: 'restaurants',
          formRoute: 'restaurants',
        };
        this.restaurant = restaurant;
        this.form.patchValue(restaurant);
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  onSubmit() {
    const fd = new FormData();

    if (this.uploadedImgFile()) {
      fd.append('image', this.uploadedImgFile());
    }

    fd.append('title', this.form.get('title').value ?? '');
    fd.append('description', this.form.get('description').value ?? '');
    fd.append('kitchen', this.form.get('kitchen').value ?? '');
    fd.append('timeOpen', this.form.get('timeOpen').value ?? 5);
    fd.append('timeClose', this.form.get('timeClose').value ?? 10);

    if (this.restaurantID) {
      this.rSub = this.restaurantService
        .update(fd, null, this.restaurantID)
        .subscribe({
          next: (message) => {
            MaterialService.toast(message.message);
            void this.router.navigate(['st/restaurants']);
          },
          error: (error) => MaterialService.toast(error.error.message),
        });
    } else {
      this.rSub = this.restaurantService.create(fd).subscribe({
        next: (message) => {
          MaterialService.toast(message.message);
          void this.router.navigate(['st/restaurants']);
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
    }
  }

  openRestaurantsPage() {
    void this.router.navigate(['st/restaurants']);
  }

  openDelTemplate() {
    this.isDelete = true;
    this.form.disable();
  }

  checkTitleRestaurant() {
    const title = this.form.get('title').value;
    if (title.length > 5) {
      this.restaurants.some(
        (restaurant) =>
          (this.isError =
            title.toLowerCase() == restaurant.title.toLocaleLowerCase() &&
            restaurant._id !== this.restaurantID),
      );
    }
  }

  getTypePlace(typePlace: string): string {
    let namePlace: string;

    switch (typePlace) {
      case 'Ресторан':
        namePlace = 'restaurant';
        break;
      case 'Кафе':
        namePlace = 'сafe';
        break;
      case 'Выпечка':
        namePlace = 'bakery';
        break;
      default:
        namePlace = 'other';
    }
    return namePlace;
  }
}
