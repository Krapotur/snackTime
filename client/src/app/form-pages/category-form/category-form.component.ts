import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeleteTemplateComponent} from "../../shared/components/delete-template/delete-template.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {Category, Elem} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {CategoryService} from "../../shared/services/category.service";

@Component({
  selector: 'app-category-form',
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
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss', '../../shared/styles/style-form.scss']
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  form: FormGroup
  isDelete = false
  isError = false
  categoryID: string = ''
  image: File
  cSub: Subscription
  category: Category
  categories: Category[] = []
  elem: Elem

  @ViewChild('inputImg') inputImgRef: ElementRef

  ngOnInit() {
    this.categoryID = this.route.snapshot.params['id'] ?
      this.route.snapshot.params['id']
      : ''

    this.getCategoryByID()
    this.getCategories()
  }

  ngOnDestroy() {
    if (this.cSub) this.cSub.unsubscribe()
  }

  generateForm(category?: Category) {
    this.form = new FormGroup({
      title: new FormControl(category ? category.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)]),
      imgSrc: new FormControl(category ? category.imgSrc : '', Validators.required)
    })
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  getCategories() {
    this.cSub = this.categoryService.getCategories().subscribe({
      next: categories => this.categories = categories,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getCategoryByID() {
    this.categoryService.getCategoryByID(this.categoryID).subscribe({
      next: category => {
        this.elem = {
          id: category._id,
          title: category.title,
          route: 'assortment',
          formRoute: 'category'
        }
        this.category = category
        this.generateForm(category)
      },
      error: error => MaterialService.toast(error.error.error)
    })
  }

  onSubmit() {
    const fd = new FormData()

    if (this.image) fd.append('image', this.image, this.image.name)
    fd.append('title', this.form.get('title').value)

    if (this.categoryID) {
      this.cSub = this.categoryService.update(fd, null, this.categoryID).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          void this.router.navigate(['admin/assortment'])
        },
        error: error => MaterialService.toast(error.error.message)
      })
    } else {
      this.cSub = this.categoryService.create(fd).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          void this.router.navigate(['admin/assortment'])
        },
        error: error => MaterialService.toast(error.error.message)
      })
    }
  }

  openAssortmentPage() {
    void this.router.navigate(['admin/assortment'])
  }

  checkTitleCategory() {
    const title = this.form.get('title').value
    if (title.length > 5) {
      this.isError = this.categories.some(category => title.toLowerCase() == category.title.toLowerCase() &&
        category._id !== this.categoryID)
    }
  }

  openDelTemplate() {
    this.isDelete = true
    this.form.disable()
  }
}
