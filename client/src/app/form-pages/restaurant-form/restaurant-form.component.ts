import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {Kitchen} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {KitchenService} from "../../shared/services/kitchen.service";
import {MaterialService} from "../../shared/classes/material.service";
import {RouterLink} from "@angular/router";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";

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
    NgxMaterialTimepickerModule,
    NgForOf,
    NgIf,
    RouterLink,
    NgClass,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss', '../../../styles.scss']
})
export class RestaurantFormComponent implements OnInit, OnDestroy {
  form: FormGroup
  kSub: Subscription
  kitchens: Kitchen [] = []
  image: File
  isDelete = false
  restaurantID = ''

  @ViewChild('inputImg') inputImgRef: ElementRef

  constructor(private kitchenService: KitchenService) {
  }

  ngOnInit() {
    this.generateForm()
  }

  ngOnDestroy() {
    if (this.kSub) this.kSub.unsubscribe()
  }

  generateForm() {
    this.getKitchens()
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      workTime: new FormControl('', [Validators.required]),
      kitchen: new FormControl('', [Validators.required]),
      imgSrc: new FormControl('', )
    })
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: kitchens => this.kitchens = kitchens,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  onSubmit(){

  }

  openRestaurantsPage(){

  }
}
