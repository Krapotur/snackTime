import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeleteTemplateComponent} from "../../shared/components/delete-template/delete-template.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {Category, Elem, Position} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {PositionService} from "../../shared/services/position.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FilterKitchenPipe} from "../../shared/pipes/filter-kitchen.pipe";

@Component({
  selector: 'app-position-form',
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
    NgOptimizedImage,
    AsyncPipe,
    DeleteTemplateComponent,
    FilterKitchenPipe,
  ],
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss', '../../shared/styles/style-form.scss']
})
export class PositionFormComponent implements OnInit, OnDestroy {
  private positionService = inject(PositionService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  form: FormGroup
  isDelete = false
  isError = false
  positionID: string = ''
  categoryID: string = ''
  image: File
  pSub: Subscription
  cSub: Subscription
  position: Position
  positions: Position[] = []
  categories: Category[] = []
  elem: Elem

  @ViewChild('inputImg') inputImgRef: ElementRef

  ngOnInit() {
    this.positionID = this.route.snapshot.params['id'] ?
      this.route.snapshot.params['id']
      : ''

    this.route.queryParams.subscribe(params => {
      if (params['category']) this.categoryID = params['category']
    })

    this.generateForm()
    this.getPositionById()
    this.getPositions()
  }

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
  }

  generateForm(position?: Position) {
    this.form = new FormGroup({
      title: new FormControl(position ? position.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)]),
      price: new FormControl(position ? position.price : 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(5000)]),
      composition: new FormControl(position ? position.composition : '', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(250)]),
      weight: new FormControl(position ? position.weight : 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(2000)]),
      proteins: new FormControl(position ? position.proteins : 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(300)]),
      fats: new FormControl(position ? position.fats : 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(300)]),
      carbs: new FormControl(position ? position.carbs : 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(300)]),
      caloric: new FormControl(position ? position.caloric : 0, [
        Validators.required,
        Validators.min(1),
        Validators.max(2000)]),
      imgSrc: new FormControl('', Validators.required)
    })
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  getPositions() {
    this.pSub = this.positionService.getPositions().subscribe({
      next: positions => this.positions = positions,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getPositionById() {
    this.positionService.getPositionByID(this.positionID).subscribe({
      next: position => {
        this.elem = {
          id: position._id,
          title: position.title,
          route: 'assortment',
          formRoute: 'position'
        }
        this.position = position
        this.generateForm(this.position)
      },
      error: error => MaterialService.toast(error.error.error)
    })
  }

  onSubmit() {
    let user = JSON.parse(localStorage.getItem('profile'))
    const fd = new FormData()

    if (this.image) fd.append('image', this.image, this.image.name)
    fd.append('title', this.form.get('title').value)
    fd.append('price', this.form.get('price').value)
    fd.append('composition', this.form.get('composition').value)
    fd.append('weight', this.form.get('weight').value)
    fd.append('proteins', this.form.get('proteins').value)
    fd.append('fats', this.form.get('fats').value)
    fd.append('carbs', this.form.get('carbs').value)
    fd.append('caloric', this.form.get('caloric').value)
    fd.append('category', this.categoryID)
    fd.append('restaurant', user['rest'])

    if (this.positionID) {
      this.pSub = this.positionService.update(fd, null, this.positionID).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          void this.router.navigate(['st/positions'], {
            queryParams: {
              category: this.position.category
            }
          })
        },
        error: error => MaterialService.toast(error.error.message)
      })
    } else {
      this.pSub = this.positionService.create(fd).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          void this.router.navigate(['st/positions'], {
            queryParams: {
              category: this.categoryID
            }
          })
        },
        error: error => MaterialService.toast(error.error.message)
      })
    }
  }

  openPositionsPage() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        void this.router.navigate(['st/positions'], {
          queryParams: {
            category: this.categoryID.length ? this.categoryID : this.position.category
          }
        })
      } else void this.router.navigate(['st/assortment'])
    })

    if (this.route.snapshot.params['id']) {
      void this.router.navigate(['st/positions'], {
        queryParams: {
          category: this.position.category
        }
      })
    }
  }


  checkTitlePosition() {
    const title = this.form.get('title').value
    if (title.length > 5) {
      this.isError = this.positions.some(position => title.toLowerCase() == position.title.toLowerCase())
    }
  }

  openDelTemplate() {
    this.isDelete = true
    this.form.disable()
  }
}
