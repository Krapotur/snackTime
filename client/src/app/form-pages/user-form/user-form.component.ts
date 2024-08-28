import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../shared/services/restaurant.service";
import {Elem, Group, Restaurant, User} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FilterKitchenPipe} from "../../shared/pipes/filter-kitchen.pipe";
import {DeleteTemplateComponent} from "../../shared/components/delete-template/delete-template.component";
import {FilterRestaurantPipe} from "../../shared/pipes/filter-restaurant";
import {UserService} from "../../shared/services/user.service";
import {MatCheckbox} from "@angular/material/checkbox";
import {GroupService} from "../../shared/services/group.service";
import {FilterGroupPipe} from "../../shared/pipes/filter-group.pipe";

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
    MatCheckbox,
    FilterGroupPipe,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['../../shared/styles/style-form.scss', './user-form.component.scss',]
})
export class UserFormComponent implements OnInit, OnDestroy {
  form: FormGroup
  formPsw: FormGroup
  rSub: Subscription
  uSub: Subscription
  gSub: Subscription
  restaurants: Restaurant[] = []
  groups: Group[] = []
  user: User | undefined
  isDelete = false
  userID: string
  elem: Elem
  image: File
  isVisibleBtn: boolean
  isChecked = true

  @ViewChild('inputImg') inputImgRef: ElementRef

  constructor(private restaurantService: RestaurantService,
              private groupService: GroupService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.userID = this.route.snapshot.params['id'] ?
      this.route.snapshot.params['id']
      : ''

    this.getUserById()
    this.getRestaurants()
    this.getGroups()
  }

  ngOnDestroy() {
    if (this.rSub) this.rSub.unsubscribe()
    if (this.uSub) this.uSub.unsubscribe()
  }

  generateForm(user?: User) {
    this.form = new FormGroup({
      lastName: new FormControl(user ? user.lastName : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]),
      firstName: new FormControl(user ? user.firstName : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]),
      login: new FormControl(user ? user.login : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)]),
      password: new FormControl('', [this.user ?
        Validators.nullValidator : Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15)]),
      pswConfirm: new FormControl('', this.user ?
        Validators.nullValidator : Validators.required),
      email: new FormControl(user ? user.email : '', [
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(40)]),
      phone: new FormControl(user ? user.phone : '', [
        Validators.required,
        Validators.pattern("^((\\+7?)|0)?[0-9]{11}$")]),
      group: new FormControl(user ? user.group : '', Validators.required),
      restaurant: new FormControl(user ? user.restaurant : ''),
      imgSrc: new FormControl(user ? user.imgSrc : '',)
    })
  }

  generateFormPsw() {
    this.form.disable()
    this.formPsw = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15)]),
      pswConfirm: new FormControl('', Validators.required)
    })
    this.isVisibleBtn = false
  }

  updatePassword(){
    delete this.user.status
    let user: User = {
      ...this.user,
      password: this.formPsw.get('pswConfirm').value
    }

    this.uSub = this.userService.update(user).subscribe({
      next: message => {
        MaterialService.toast(message.message)
        void this.router.navigate(['admin/users'])
      },
      error: error => MaterialService.toast(error.error.error)
    })
  }

  onSubmit() {
    let user: User = {
      lastName: this.form.get('lastName').value,
      firstName: this.form.get('firstName').value,
      login: this.form.get('login').value,
      email: this.form.get('email').value,
      phone: this.form.get('phone').value,
      group: this.form.get('group').value,
      restaurant: this.isChecked && this.form.get('restaurant').value ? this.form.get('restaurant').value : '',
    }

    if(!this.user){
      user.password = this.form.get('password').value

      this.uSub = this.userService.create(user, this.image ? this.image : null).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          void this.router.navigate(['admin/users'])
        },
        error: error => MaterialService.toast(error.error.error)
      })
    } else {
      this.uSub = this.userService.update(user, this.image ? this.image : null).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          void this.router.navigate(['admin/users'])
        },
        error: error => MaterialService.toast(error.error.error)
      })
    }
  }

  getRestaurants() {
    this.rSub = this.restaurantService.getRestaurants().subscribe({
      next: restaurant => this.restaurants = restaurant,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getGroups() {
    this.gSub = this.groupService.getGroups().subscribe({
      next: groups => this.groups = groups,
      error: error => MaterialService.toast(error.error.error)
    })
  }

  getUserById() {
    if (this.userID.length > 0) {
      this.userService.getUserByID(this.userID).subscribe({
        next: user => {
          this.generateForm(user)
          this.elem = {
            id: user._id,
            title: user.lastName + ' ' + user.firstName,
            route: 'users',
            formRoute: 'user'
          }
          this.user = user
          this.isVisibleBtn = true
        },
        error: error => MaterialService.toast(error.error.error)
      })
    } else {
      this.generateForm()
    }
  }

  openDelTemplate() {
    this.isDelete = !this.isDelete
    this.form.disable()
  }

  checkLogin() {
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
    console.log(this.image)
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  openUsersPage() {
    void this.router.navigate(['admin/users'])
  }

  resetForm() {
    this.form.reset()
    this.isVisibleBtn = true
    this.isChecked = false
    this.image = null
  }

  checkValidNumber(): boolean {
    let isTrue = true
    if (this.form.get('phone').value) {
      isTrue = this.form.get('phone').value.toString().charAt(0) == '7';
    }
    return isTrue
  }

  enableForm(){
    this.isVisibleBtn = !this.isVisibleBtn
    this.form.enable()
  }

  toggle(event){
    this.isChecked = event.checked
  }

}
