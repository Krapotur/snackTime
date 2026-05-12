import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { Elem, Promo } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PromoService } from '../../shared/services/promo.service';
import { DeleteTemplateComponent } from '../../shared/components/delete-template/delete-template.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-promo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    NgIf,
    NgClass,
    DeleteTemplateComponent,
  ],
  templateUrl: './promo-form.component.html',
  styleUrls: [
    './promo-form.component.scss',
    '../../shared/styles/style-form.scss',
  ],
})
export class PromoFormComponent implements OnInit, OnDestroy {
  private sharedService = inject(SharedService);
  private promoService = inject(PromoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    description: new FormControl(null, [Validators.maxLength(200)]),
    link: new FormControl(null),
    image: new FormControl(
      null,
      this.route.snapshot.params['id'] ? [] : Validators.required,
    ),
  });
  pSub: Subscription;
  sSub: Subscription;
  promoID: string;
  promos: Promo[];
  promo: Promo;
  elem: Elem;
  uploadedImgFile = signal<File | null>(null);
  uploadedImgLink = signal(null);
  imageUrl: string | null = null;
  isError = false;
  isDelete = false;

  ngOnInit() {

    if (this.route.snapshot.params['id']) {
      this.promoID = this.route.snapshot.params['id'];
      this.getPromoById(this.promoID);
    }

    this.getPromos();
    this.sharedService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    this.pSub?.unsubscribe();
    this.sSub?.unsubscribe();
  }

  uploadImg($event: any) {
    this.uploadedImgFile.set($event.target.files[0]);
    this.uploadedImgLink.set(URL.createObjectURL($event.target.files[0]));
  }

  getPromos() {
    let restaurantID = this.sharedService.getRestaurantID();
    console.log(restaurantID)
    this.pSub = this.promoService.getPromos(restaurantID).subscribe({
      next: (promos) => (this.promos = promos),
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  getPromoById(id: string) {
    this.promoService.getPromoByID(id).subscribe({
      next: (promo) => {
        this.elem = {
          id: promo._id,
          title: promo.title,
          route: 'promos',
          formRoute: 'promos',
        };
        this.promo = promo;
        this.form.patchValue(this.promo);
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
    fd.append('description', this.form.get('description').value ?? '');
    fd.append('link', this.form.get('link').value ?? '');
    fd.append('restaurant', this.sharedService.getRestaurantID());

    if (this.promoID) {
      this.pSub = this.promoService.update(fd, null, this.promoID).subscribe({
        next: (message) => {
          MaterialService.toast(message.message);
          void this.router.navigate(['st/promos']);
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
    } else {
      this.pSub = this.promoService.create(fd).subscribe({
        next: (message) => {
          MaterialService.toast(message.message);
          void this.router.navigate(['st/promos']);
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
    }
  }

  openPromosPage() {
    void this.router.navigate(['st/promos']);
  }

  openDelTemplate() {
    this.isDelete = true;
    this.form.disable();
  }

  checkTitlePromo() {
    const title = this.form.get('title').value;
    if (!this.promos?.length) return;

    if (title.length > 3) {
      this.isError = this.promos.some(
        (promo) =>
          title.toLowerCase() === promo.title.toLowerCase() &&
          promo._id !== this.promoID,
      );
    }
  }
}
