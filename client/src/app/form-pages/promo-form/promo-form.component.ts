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
  styleUrls: ['./promo-form.component.scss', '../../shared/styles/style-form.scss'],
})
export class PromoFormComponent implements OnInit, OnDestroy {
  private sharedService = inject(SharedService);
  private promoService = inject(PromoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  pSub: Subscription;
  sSub: Subscription;
  promoID: string;
  promos: Promo[];
  promo: Promo;
  elem: Elem;
  image = signal<File | null>(null);
  uploadedImgLink = computed(() =>
    this.image() ? URL.createObjectURL(this.image()) : null,
  );
  isError = false;
  isDelete = false;

  ngOnInit() {
    this.promoID = this.route.snapshot.params['id'] ?? '';

    if (this.promoID) {
      this.getPromoById();
    } else {
      this.generateForm();
    }

    this.getPromos();
    this.sharedService.sharedData$.subscribe((value) => {
      this.isDelete = value;
      this.isDelete ? this.form.disable() : this.form.enable();
    });
  }

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe();
    if (this.sSub) this.sSub.unsubscribe();
  }

  generateForm(promo?: Promo) {
    this.form = new FormGroup({
      title: new FormControl(promo?.title ?? '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      description: new FormControl(promo?.description ?? '', [
        Validators.maxLength(200),
      ]),
      link: new FormControl(promo?.link ?? '', [
        Validators.maxLength(255),
      ]),
      imgSrc: new FormControl(promo?.imgSrc ?? '', Validators.required),
    });
  }

  getPromos() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const restaurantID = profile?.rest || '';

    this.pSub = this.promoService.getPromos(restaurantID).subscribe({
      next: (promos) => (this.promos = promos),
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  getPromoById() {
    this.promoService.getPromoByID(this.promoID).subscribe({
      next: (promo) => {
        this.generateForm(promo);
        this.elem = {
          id: promo._id,
          title: promo.title,
          route: 'promos',
          formRoute: 'promos',
        };
        this.promo = promo;
      },
      error: (error) => MaterialService.toast(error.error.error),
    });
  }

  uploadImg($event: any) {
    this.image.set($event.target.files[0] as File);
  }

  onSubmit() {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const fd = new FormData();
    const imageFile = this.image();

    if (imageFile) fd.append('image', imageFile, imageFile.name);

    fd.append('title', this.form.get('title').value);
    fd.append('description', this.form.get('description').value);
    fd.append('link', this.form.get('link').value);
    fd.append('restaurant', profile?.rest || '');

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
