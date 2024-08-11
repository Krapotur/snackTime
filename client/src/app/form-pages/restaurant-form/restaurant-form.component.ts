import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {Kitchen, Restaurant} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {KitchenService} from "../../shared/services/kitchen.service";
import {MaterialService} from "../../shared/classes/material.service";
import {Router, RouterLink} from "@angular/router";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {FilterKitchenPipe} from "../../shared/pipes/filter-kitchen.pipe";
import {AuthService} from "../../shared/services/auth.service";

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
  image: File
  isError = false
  isDelete = false
  restaurantID = ''
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
              private router: Router) {
  }

  ngOnInit() {
    this.generateForm()
    this.getKitchens()
    this.getRestaurants()
  }

  ngOnDestroy() {
    if (this.kSub) this.kSub.unsubscribe()
    if (this.rSub) this.rSub.unsubscribe()
  }

  generateForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(14)]),
      description: new FormControl('', [Validators.required, Validators.minLength(100)]),
      timeStart: new FormControl('', Validators.required),
      timeEnd: new FormControl('', Validators.required),
      kitchen: new FormControl('', Validators.required),
      typePlace: new FormControl('', Validators.required),
      imgSrc: new FormControl('', Validators.required)
    })
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: kitchens => this.kitchens = kitchens,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getRestaurants() {
    this.rSub = this.restaurantService.getRestaurants().subscribe({
      next: restaurants => this.restaurants = restaurants,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  onSubmit() {
    const time = this.form.get('timeStart').value + '-' + this.form.get('timeEnd').value

    let restaurant: Restaurant = {
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      work_time: time,
      kitchen: this.form.get('kitchen').value,
      typePlace: this.getTypePlace(this.form.get('typePlace').value)
    }

    this.restaurantService.create(restaurant, this.image).subscribe({
      next: message => {
        MaterialService.toast(message.message)
        this.router.navigate(['admin/restaurants']).then()
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openRestaurantsPage() {
    this.router.navigate(['admin/restaurants']).then()
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
