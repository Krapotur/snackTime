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
import { SharedDelService } from '../../shared/services/shared-del.service';

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
  private sharedDelService = inject(SharedDelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isDelete = false;
  isError = false;
  positionID: string = '';
  categoryID: string = '';
  image = signal<File | null>(null);
  uploadedImgLink = computed(() =>
    this.image() ? URL.createObjectURL(this.image()) : null,
  );
  imageUrl: string | null = null;
  pSub: Subscription;
  cSub: Subscription;
  position: Position | null;
  positions: Position[];
  elem: Elem;

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.positionID = this.route.snapshot.params['id'];
      this.getPositionById();
    }

    this.route.queryParams.subscribe((params) => {
      if (params['category']) this.categoryID = params['category'];
    });

    this.generateForm();

    this.sharedDelService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe();
    if (this.cSub) this.cSub.unsubscribe();
  }

  generateForm(position?: Position) {
    this.form = new FormGroup({
      title: new FormControl(position?.title ?? null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      price: new FormControl(position?.price ?? null, [
        Validators.required,
        Validators.min(10),
        Validators.max(5000),
      ]),
      weight: new FormControl(position?.weight ?? null, [
        Validators.required,
        Validators.min(20),
        Validators.max(2000),
      ]),
      caloric: new FormControl(position?.caloric ?? 0, [
        Validators.min(0),
        Validators.max(1000),
      ]),
      proteins: new FormControl(position?.proteins ?? 0, [
        Validators.min(0),
        Validators.max(300),
      ]),
      fats: new FormControl(position ? position.fats : 0, [
        Validators.min(0),
        Validators.max(300),
      ]),
      carbs: new FormControl(position ? position.carbs : 0, [
        Validators.min(0),
        Validators.max(300),
      ]),
      proteins: new FormControl(position?.proteins ?? 0),
      fats: new FormControl(position ? position.fats : 0),
      carbs: new FormControl(position ? position.carbs : 0),
      isPopular: new FormControl(position ? position.isPopular : false),
      discount: new FormControl(position ? position.discount : 0),
      composition: new FormControl(position ? position.composition : '', [
        Validators.required,
        Validators.minLength(10),
      ]),
      imgSrc: new FormControl(
        position?.imgSrc ?? '',
        Validators.required,
      ),
    });
  }

  uploadImg($event: any) {
    this.image.set($event.target.files[0] as File);
  }

  getPositionsByCategory() {
    this.pSub = this.positionService
      .getPositionsByCategoryID(this.categoryID)
      .subscribe({
        next: (positions) => (this.positions = positions),
        error: (error) => MaterialService.toast(error.error.message),
      });
  }

  getPositionById() {
    this.positionService.getPositionByID(this.positionID).subscribe({
      next: (position) => {
        this.elem = {
          id: position._id,
          title: position.title,
          route: 'positions',
          formRoute: 'positions',
        };
        this.position = position;
        this.generateForm(this.position);
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  onSubmit() {
    let user = JSON.parse(localStorage.getItem('profile'));
    const fd = new FormData();

    if (this.image) fd.append('image', this.image(), this.image.name);
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
    fd.append('category', this.categoryID);
    fd.append('restaurant', user['rest']);

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
    this.getPositionsByCategory();
    const title = this.form.get('title').value;
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
