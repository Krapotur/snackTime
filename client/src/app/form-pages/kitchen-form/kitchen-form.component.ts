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
import {
  NgClass,
  NgIf,
} from '@angular/common';
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
import { SharedDelService } from '../../shared/services/shared-del.service';

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
  private sharedDelService = inject(SharedDelService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  isDelete = false;
  isError = false;
  kitchenID: string = '';
  image = signal<File | null>(null);
  uploadedImgLink = computed(() =>
    this.image() ? URL.createObjectURL(this.image()) : null,
  );
  cSub: Subscription;
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
    this.generateForm();

    this.sharedDelService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    if (this.kSub) this.kSub.unsubscribe();
  }

  generateForm(kitchen?: Kitchen) {
    this.form = new FormGroup({
      title: new FormControl(kitchen ? kitchen.title : '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]),
      imgSrc: new FormControl('', Validators.required),
    });
  }

  uploadImg($event: any) {
    this.image.set($event.target.files[0] as File);
  }

  getKitchens() {
    this.kSub = this.kitchenService.getKitchens().subscribe({
      next: (kitchens) => (this.kitchens = kitchens),
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  getKitchenById() {
    this.kitchenService.getKitchenByID(this.kitchenID).subscribe({
      next: (kitchen) => {
        this.elem = {
          id: kitchen._id,
          title: kitchen.title,
          route: 'restaurants',
          formRoute: 'kitchens',
        };
        this.kitchen = kitchen;
        this.generateForm(this.kitchen);
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  onSubmit() {
    const fd = new FormData();

    if (this.image) fd.append('image', this.image(), this.image.name);
    fd.append('title', this.form.get('title').value);

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
