import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {Restaurant} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {Router, RouterLink} from "@angular/router";
import {FilterKitchenPipe} from "../../shared/pipes/filter-kitchen.pipe";
import {DeleteTemplateComponent} from "../../shared/components/delete-template/delete-template.component";
import {FilterRestaurantPipe} from "../../shared/pipes/filter-restaurant";

@Component({
  selector: 'app-user-form',
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
    FilterRestaurantPipe,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['../../shared/styles/style-form.scss', './user-form.component.scss',]
})
export class UserFormComponent implements OnInit, OnDestroy {
  form: FormGroup
  rSub: Subscription
  restaurants: Restaurant[] = []
  isDelete = false
  userID: string
  isError = false
  image: File

  @ViewChild('inputImg') inputImgRef: ElementRef

  constructor(private restaurantService: RestaurantService,
              private router: Router) {
  }

  ngOnInit() {
    this.getRestaurants()
    this.generateForm()
  }

  ngOnDestroy() {
    if (this.rSub) this.rSub.unsubscribe()
  }

  generateForm() {
    this.form = new FormGroup({
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]),
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15)]),
      pswConfirm: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(40)]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern("^((\\+7?)|0)?[0-9]{11}$")]),
      restaurant: new FormControl('', Validators.required),
      imgSrc: new FormControl('',)
    })
  }

  onSubmit(){

  }

  getRestaurants() {
    this.rSub = this.restaurantService.getRestaurants().subscribe({
      next: restaurant => this.restaurants = restaurant,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openDelTemplate() {
  }

  checkLogin() {
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  openRestaurantsPage(){
    void this.router.navigate(['admin/users'])
  }

}
