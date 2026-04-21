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
  private sharedService = inject(SharedService);
  form: FormGroup;
  kSub: Subscription;
  rSub: Subscription;
  sSub: Subscription;
  restaurantID: string;
  kitchens: Kitchen[] = [];
  restaurants: Restaurant[];
  restaurant: Restaurant;
  elem: Elem;
  image = signal<File | null>(null);
  uploadedImgLink = computed(() =>
    this.image() ? URL.createObjectURL(this.image()) : null,
  );
  isError = false;
  isDelete = false;
  sortPlaces = ['Ресторан', 'Кафе', 'Выпечка', 'Другое'];

  hours = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  constructor(
    private kitchenService: KitchenService,
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.restaurantID = this.route.snapshot.params['id'] ?? '';

    if (this.restaurantID) {
      this.getRestaurantById();
    } else {
      this.generateForm();
    }

    this.getKitchens();
    this.getRestaurants();
    this.sharedService.sharedData$.subscribe((x) => {
      this.isDelete = x;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    if (this.kSub) this.kSub.unsubscribe();
    if (this.rSub) this.rSub.unsubscribe();
    if (this.sSub) this.sSub.unsubscribe();
  }

  generateForm(restaurant?: Restaurant) {
    console.log('restaurant', restaurant);
    this.form = new FormGroup({
      title: new FormControl(restaurant?.title ?? '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]),
      description: new FormControl(restaurant?.description ?? '', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(100),
      ]),
      timeOpen: new FormControl(restaurant?.timeOpen ?? 0, Validators.required),
      timeClose: new FormControl(
        restaurant?.timeClose ?? 0,
        Validators.required,
      ),
      kitchen: new FormControl(restaurant?.kitchen ?? '', Validators.required),
      typePlace: new FormControl(restaurant?.typePlace, Validators.required),
      imgSrc: new FormControl('', Validators.required),
    });
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
        this.generateForm(restaurant);
        this.elem = {
          id: restaurant._id,
          title: restaurant.title,
          route: 'restaurants',
          formRoute: 'restaurants',
        };
        this.restaurant = restaurant;
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  uploadImg($event: any) {
    this.image.set($event.target.files[0] as File);
  }

  onSubmit() {
    const fd = new FormData();

    if (this.image) fd.append('image', this.image(), this.image.name);

    fd.append('title', this.form.get('title').value);
    fd.append('description', this.form.get('description').value);
    fd.append('kitchen', this.form.get('kitchen').value);
    fd.append('timeOpen', this.form.get('timeOpen').value);
    fd.append('timeClose', this.form.get('timeClose').value);
    fd.append('typePlace', this.getTypePlace(this.form.get('typePlace').value));

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
