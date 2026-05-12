import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Elem, Kitchen } from '../../shared/interfaces';
import { KitchenService } from '../../shared/services/kitchen.service';
import { MaterialService } from '../../shared/classes/material.service';
import { DeleteTemplateComponent } from '../../shared/components/delete-template/delete-template.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-kitchen-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgIf,
    NgClass,
    DeleteTemplateComponent,
  ],
  templateUrl: './kitchen-form.component.html',
  styleUrls: [
    './kitchen-form.component.scss',
    '../../shared/styles/style-form.scss',
  ],
})
export class KitchenFormComponent implements OnInit, OnDestroy {
  private kitchenService = inject(KitchenService);
  private sharedDelService = inject(SharedService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),
    image: new FormControl(
      null,
      this.route.snapshot.params['id'] ? [] : Validators.required,
    ),
  });
  isDelete = false;
  isError = false;
  kitchenID: string = '';
  uploadedImgFile = signal<File | null>(null);
  uploadedImgLink = signal(null);
  imageUrl: string | null = null;
  kSub: Subscription;
  kitchen: Kitchen;
  kitchens: Kitchen[] = [];
  elem: Elem;

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.kitchenID = this.route.snapshot.params['id'];
      this.getKitchenById();
    }

    this.getKitchens();

    this.sharedDelService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    this.kSub?.unsubscribe();
  }

  uploadImg($event: any) {
    this.uploadedImgFile.set($event.target.files[0]);
    this.uploadedImgLink.set(URL.createObjectURL($event.target.files[0]));
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: (kitchens) => (this.kitchens = kitchens),
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  getKitchenById() {
   this.kSub = this.kitchenService.getKitchenByID(this.kitchenID).subscribe({
      next: (kitchen) => {
        this.elem = {
          id: kitchen._id,
          title: kitchen.title,
          route: 'restaurants',
          formRoute: 'kitchens',
        };
        this.kitchen = kitchen;
        this.form.patchValue(this.kitchen);
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  onSubmit() {
    const fd = new FormData();

    if (this.uploadedImgFile()) {
      fd.append('image', this.uploadedImgFile());
    }

    fd.append('title', this.form.get('title').value ?? '');

    if (this.kitchenID) {
      setTimeout(() => {
        this.kSub = this.kitchenService
          .update(fd, null, this.kitchenID)
          .subscribe({
            next: (message) => {
              MaterialService.toast(message.message);
              void this.router.navigate(['st/restaurants']);
            },
            error: (error) => MaterialService.toast(error.error.message),
          });
      }, 300);
    } else {
      setTimeout(() => {
        this.kSub = this.kitchenService.create(fd).subscribe({
          next: (message) => {
            MaterialService.toast(message.message);
            void this.router.navigate(['st/restaurants']);
          },
          error: (error) => MaterialService.toast(error.error.message),
        });
      }, 300);
    }
  }

  openRestaurantsPage() {
    void this.router.navigate(['st/restaurants']);
  }

  checkTitleKitchen() {
    const title = this.form.get('title').value;
    if (title.length > 5) {
      this.isError = this.kitchens.some(
        (kitchen) =>
          title.toLowerCase() == kitchen.title.toLowerCase() &&
          kitchen._id !== this.kitchenID,
      );
    }
  }

  openDelTemplate() {
    this.isDelete = true;
    this.form.disable();
  }
}
