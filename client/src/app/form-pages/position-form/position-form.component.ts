import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeleteTemplateComponent} from "../../shared/components/delete-template/delete-template.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {Elem, Position} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {PositionService} from "../../shared/services/position.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

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
  ],
  templateUrl: './position-form.component.html',
  styleUrl: './position-form.component.scss'
})
export class PositionFormComponent implements OnInit, OnDestroy{
  private positionService = inject(PositionService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  form: FormGroup
  isDelete = false
  isError = false
  positionID: string = ''
  image: File
  pSub: Subscription
  position: Position
  positions: Position[] = []
  elem: Elem

  @ViewChild('inputImg') inputImgRef: ElementRef

  ngOnInit() {
    this.positionID = this.route.snapshot.params['id'] ?
      this.route.snapshot.params['id']
      : ''

    this.generateForm()
    this.getPositionById()
    this.getPositions()
  }

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe()
  }

  generateForm(position?: Position) {
    this.form = new FormGroup({
      title: new FormControl(position ? position.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)]),
      composition: new FormControl(position ? position.composition : '', [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(250)]),
      weight: new FormControl(position ? position.weight : '', [
        Validators.required,
        Validators.min(50),
        Validators.max(1000)]),
      proteins:  new FormControl(position ? position.proteins : '', [
        Validators.required,
        Validators.min(1),
        Validators.max(50)]),
      fats: new FormControl(position ? position.fats : '', [
        Validators.required,
        Validators.min(1),
        Validators.max(50)]),
      carbs: new FormControl(position ? position.carbs : '', [
        Validators.required,
        Validators.min(1),
        Validators.max(150)]),
      caloric: new FormControl(position ? position.caloric : '', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)]),
      category: new FormControl(position ? position.category : '',
        Validators.required),
      imgSrc: new FormControl(position ? position.imgSrc : '', Validators.required)
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
    const fd = new FormData()

    if (this.image) fd.append('image', this.image, this.image.name)
    fd.append('title', this.form.get('title').value)
    fd.append('composition', this.form.get('composition').value)
    fd.append('weight', this.form.get('weight').value)
    fd.append('proteins', this.form.get('proteins').value)
    fd.append('fats', this.form.get('fats').value)
    fd.append('carbs', this.form.get('carbs').value)
    fd.append('caloric', this.form.get('caloric').value)
    fd.append('category', this.form.get('category').value)

    if (this.positionID) {
        this.pSub = this.positionService.update(fd, null, this.positionID).subscribe({
          next: message => {
            MaterialService.toast(message.message)
            void this.router.navigate(['admin/assortment'])
          },
          error: error => MaterialService.toast(error.error.message)
        })
    } else {
        this.pSub = this.positionService.create(fd).subscribe({
          next: message => {
            MaterialService.toast(message.message)
            void this.router.navigate(['admin/assortment'])
          },
          error: error => MaterialService.toast(error.error.message)
        })
    }
  }

  openRestaurantsPage() {
    void this.router.navigate(['admin/assortment'])
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
