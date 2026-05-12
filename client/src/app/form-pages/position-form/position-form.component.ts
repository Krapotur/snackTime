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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Elem, Position } from '../../shared/interfaces';
import { MaterialService } from '../../shared/classes/material.service';
import { PositionService } from '../../shared/services/position.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-position-form',
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
  templateUrl: './position-form.component.html',
  styleUrls: [
    './position-form.component.scss',
    '../../shared/styles/style-form.scss',
  ],
})
export class PositionFormComponent implements OnInit, OnDestroy {
  private positionService = inject(PositionService);
  private sharedDelService = inject(SharedService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(65),
    ]),
    price: new FormControl(null, [
      Validators.required,
      Validators.min(10),
      Validators.max(5000),
    ]),
    weight: new FormControl(null, [Validators.required, Validators.max(2000)]),
    caloric: new FormControl(0, [Validators.min(0), Validators.max(1000)]),
    proteins: new FormControl(0, [Validators.min(0), Validators.max(300)]),
    fats: new FormControl(0, [Validators.min(0), Validators.max(300)]),
    carbs: new FormControl(0, [Validators.min(0), Validators.max(300)]),
    isPopular: new FormControl(false),
    discount: new FormControl(0),
    composition: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(250),
    ]),
    image: new FormControl(
      null,
      this.route.snapshot.params['id'] ? [] : Validators.required,
    ),
  });

  isDelete = false;
  isError = false;
  positionID: string | null = null;
  categoryID: string | null = null;
  uploadedImgFile = signal<File | null>(null);
  uploadedImgLink = signal(null);
  imageUrl: string | null = null;
  pSub: Subscription;
  cSub: Subscription;
  position: Position | null;
  positions: Position[];
  elem: Elem;

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.positionID = this.route.snapshot.params['id'];
      this.getPositionById(this.route.snapshot.params['id']);
    }

    this.route.queryParams.subscribe((params) => {
      if (params['category']) this.categoryID = params['category'];
    });

    this.sharedDelService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
   this.pSub?.unsubscribe();
   this.cSub?.unsubscribe();
  }

  uploadImg($event: any) {
    this.uploadedImgFile.set($event.target.files[0]);
    this.uploadedImgLink.set(URL.createObjectURL($event.target.files[0]));
  }

  getPositionsByCategory(id?: string) {
    this.pSub = this.positionService
      .getPositionsByCategoryID(id ?? this.categoryID)
      .subscribe({
        next: (positions) => {
          this.positions = positions;
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
  }

  getPositionById(id: string) {
    this.pSub = this.positionService.getPositionByID(id).subscribe({
      next: (position) => {
        console.log('position', position)
        this.elem = {
          id: position._id,
          title: position.title,
          route: 'positions',
          formRoute: 'positions',
        };
        this.position = position;
        this.form.patchValue(position);
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  onSubmit() {
    const fd = new FormData();

    if (this.uploadedImgFile()) {
      fd.append('image', this.uploadedImgFile());
    }

    fd.append('title', this.form.get('title').value);
    fd.append('price', this.form.get('price').value);
    fd.append('composition', this.form.get('composition').value);
    fd.append('weight', this.form.get('weight').value ?? 0);
    fd.append('proteins', this.form.get('proteins').value ?? 0);
    fd.append('fats', this.form.get('fats').value ?? 0);
    fd.append('carbs', this.form.get('carbs').value ?? 0);
    fd.append('caloric', this.form.get('caloric').value);
    fd.append('isPopular', this.form.get('isPopular').value ?? false);
    fd.append('discount', this.form.get('discount').value ?? 0);
    fd.append('category', this.categoryID ?? this.position.category ?? '');
    fd.append('restaurant', this.sharedDelService.getRestaurantID());

    if (this.positionID) {
      this.pSub = this.positionService
        .update(fd, null, this.positionID)
        .subscribe({
          next: (message) => {
            MaterialService.toast(message.message);
            void this.router.navigate(['st/positions'], {
              queryParams: {
                category: this.position.category,
              },
            });
          },
          error: (error) => MaterialService.toast(error.error.message),
        });
    } else {
      this.pSub = this.positionService.create(fd).subscribe({
        next: (message) => {
          MaterialService.toast(message.message);
          void this.router.navigate(['st/positions'], {
            queryParams: {
              category: this.categoryID,
            },
          });
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
    }
  }

  openPositionsPage() {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        void this.router.navigate(['st/positions'], {
          queryParams: {
            category: this.categoryID ?? this.position.category,
          },
        });
      } else void this.router.navigate(['st/assortment']);
    });

    if (this.route.snapshot.params['id']) {
      void this.router.navigate(['st/positions'], {
        queryParams: {
          category: this.position.category,
        },
      });
    }
  }

  checkTitlePosition() {
    const title = this.form.get('title').value;
    this.getPositionsByCategory(this.position.category);

    if (title.length > 5) {
      this.isError = this.positions.some(
        (position) => title.toLowerCase() == position.title.toLowerCase(),
      );
    }
  }

  openDelTemplate() {
    this.isDelete = true;
    this.form.disable();
  }
}
