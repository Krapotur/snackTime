import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { DeleteTemplateComponent } from '../../shared/components/delete-template/delete-template.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, Elem } from '../../shared/interfaces';
import { MaterialService } from '../../shared/classes/material.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../shared/services/category.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    NgIf,
    NgClass,
    DeleteTemplateComponent,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: [
    './category-form.component.scss',
    '../../shared/styles/style-form.scss',
  ],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private sharedDelService = inject(SharedService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    isDrink: new FormControl(false),
    image: new FormControl(
      null,
      this.route.snapshot.params['id'] ? [] : Validators.required,
    ),
  });

  isError = false;
  categoryID: string;
  uploadedImgFile = signal<File | null>(null);
  uploadedImgLink = signal(null);
  imageUrl: string | null = null;
  cSub: Subscription;
  category: Category;
  categories: Category[] = [];
  elem: Elem;
  isDelete = false;

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.categoryID = this.route.snapshot.params['id'];
      this.getCategoryByID();
    }

    this.sharedDelService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    if (this.cSub) this.cSub.unsubscribe();
  }

  uploadImg($event: any) {
    this.uploadedImgFile.set($event.target.files[0]);
    this.uploadedImgLink.set(URL.createObjectURL($event.target.files[0]));
  }

  getCategories() {
    this.cSub = this.categoryService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  getCategoryByID() {
    this.cSub = this.categoryService
      .getCategoryByID(this.categoryID)
      .subscribe({
        next: (category) => {
          this.elem = {
            id: category._id,
            title: category.title,
            route: 'assortment',
            formRoute: 'categories',
          };
          this.category = category;
          this.form.patchValue(this.category);
        },
        error: (error) => MaterialService.toast(error.error.error),
      });
  }

  onSubmit() {
    let user = JSON.parse(localStorage.getItem('profile'));
    const fd = new FormData();

    if (this.uploadedImgFile()) {
      fd.append('image', this.uploadedImgFile());
    }

    fd.append('title', this.form.get('title').value);
    fd.append('isDrink', this.form.get('isDrink').value);

    if (this.categoryID) {
      this.cSub = this.categoryService
        .update(fd, null, this.categoryID)
        .subscribe({
          next: (message) => {
            MaterialService.toast(message.message);
            void this.router.navigate(['st/assortment']);
          },
          error: (error) => MaterialService.toast(error.error.message),
        });
    } else {
      fd.append('restaurant', user['rest']);
      this.cSub = this.categoryService.create(fd).subscribe({
        next: (message) => {
          MaterialService.toast(message.message);
          void this.router.navigate(['st/assortment']);
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
    }
  }

  openAssortmentPage() {
    void this.router.navigate(['st/assortment']);
  }

  checkTitleCategory() {
    const title = this.form.get('title').value;
    if (title.length > 5) {
      this.isError = this.categories.some(
        (category) =>
          title.toLowerCase() == category.title.toLowerCase() &&
          category._id !== this.categoryID,
      );
    }
  }

  openDelTemplate() {
    this.isDelete = true;
    this.isDelete ? this.form.disable() : this.form.enable();
  }
}
