import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {Elem, Kitchen, Restaurant} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {KitchenService} from "../../shared/services/kitchen.service";
import {MaterialService} from "../../shared/classes/material.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {FilterKitchenPipe} from "../../shared/pipes/filter-kitchen.pipe";
import {DeleteTemplateComponent} from "../../shared/components/delete-template/delete-template.component";

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
    RouterLink,
    NgClass,
    FilterKitchenPipe,
    NgOptimizedImage,
    DeleteTemplateComponent,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss', '../../shared/styles/style-form.scss']
})
export class RestaurantFormComponent implements OnInit, OnDestroy {
  form: FormGroup
  kSub: Subscription
  rSub: Subscription
  kitchens: Kitchen [] = []
  restaurants: Restaurant[]
  restaurant: Restaurant
  elem: Elem
  image: File
  isError = false
  isDelete = false
  restaurantID: string
  sortPlaces = ['Ресторан', 'Кафе', 'Другое']
  hours = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00',
    '04:30', '05:00', '05:30', '06:00', '06:30', '7:00', '7:30', '8:00', '8:30', '09:00',
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
    '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
  ]

  @ViewChild('inputImg') inputImgRef: ElementRef

  constructor(private kitchenService: KitchenService,
              private restaurantService: RestaurantService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.generateForm()
    this.getRestaurantById()
    this.getKitchens()
    this.getRestaurants()
  }

  ngOnDestroy() {
    if (this.kSub) this.kSub.unsubscribe()
    if (this.rSub) this.rSub.unsubscribe()
  }

  generateForm(restaurant?: Restaurant) {
    this.form = new FormGroup({
      title: new FormControl(restaurant ? restaurant.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)]),
      description: new FormControl(restaurant ? restaurant.description : '', [
        Validators.required,
        Validators.minLength(100)]),
      timeOpen: new FormControl(restaurant ? restaurant.timeOpen : '', Validators.required),
      timeClose: new FormControl(restaurant ? restaurant.timeClose : '', Validators.required),
      kitchen: new FormControl(restaurant ? restaurant.kitchen : '', Validators.required),
      typePlace: new FormControl(restaurant ? (restaurant.typePlace == 'restaurant' ? 'Ресторан' : 'Кафе') : '',
        Validators.required),
      imgSrc: new FormControl(restaurant ? restaurant.imgSrc : '', Validators.required)
    })
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: kitchens => this.kitchens = kitchens,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getRestaurants() {
    setTimeout(() => {
      this.rSub = this.restaurantService.getRestaurants().subscribe({
        next: restaurants => this.restaurants = restaurants,
        error: error => MaterialService.toast(error.error.message)
      })
    }, 500)

  }

  getRestaurantById() {
    this.restaurantID = this.route.snapshot.params['id']
    this.restaurantService.getRestaurantByID(this.restaurantID).subscribe({
      next: restaurant => {
        this.generateForm(restaurant)
        this.elem = {
          id: restaurant._id,
          title: restaurant.title,
          route: 'restaurants',
        }
        this.restaurant = restaurant
      },
      error: error => MaterialService.toast(error.error.error)
    })
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  onSubmit() {
    let restaurant: Restaurant = {
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      timeOpen: this.form.get('timeOpen').value,
      timeClose: this.form.get('timeClose').value,
      kitchen: this.form.get('kitchen').value,
      typePlace: this.getTypePlace(this.form.get('typePlace').value)
    }

    if (this.restaurantID) {
      restaurant._id = this.restaurantID
      this.rSub = this.restaurantService.update(restaurant, this.image).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          this.router.navigate(['admin/restaurants']).then()
        },
        error: error => MaterialService.toast(error.error.message)
      })
    } else {
      this.rSub = this.restaurantService.create(restaurant, this.image).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          this.router.navigate(['admin/restaurants']).then()
        },
        error: error => MaterialService.toast(error.error.message)
      })
    }
  }

  openRestaurantsPage() {
    this.router.navigate(['admin/restaurants']).then()
  }

  openDelTemplate() {
    this.isDelete = true
    this.form.disable()
  }

  checkTitleRestaurant() {
    const title = this.form.get('title').value
    this.restaurants.forEach(restaurant => {
      this.isError = title.toLowerCase() == restaurant.title.toLocaleLowerCase();
    })
  }

  getTypePlace(typePlace: string): string {
    let namePlace: string

    switch (typePlace) {
      case 'Ресторан':
        namePlace = 'restaurant';
        break;
      case 'Кафе':
        namePlace = 'сafe';
        break;
      default:
        namePlace = 'other'
    }
    return namePlace;
  }
}
