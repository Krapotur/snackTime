import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { Elem } from '../../interfaces';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { MaterialService } from '../../classes/material.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-delete-template',
  standalone: true,
  imports: [MatFabButton, NgIf],
  templateUrl: './delete-template.component.html',
  styleUrl: './delete-template.component.scss',
})
export class DeleteTemplateComponent implements OnInit, OnDestroy {
  private sharedService = inject(SharedService);
  private router = inject(Router);

  title = '';
  dSub: Subscription;
  isDelete = false;

  @Input() elemIn: Elem;
  isRestaurant = false;

  ngOnInit() {
    this.title = this.elemIn.title;
    this.isRestaurant = this.elemIn?.route === 'restaurants';
  }

  ngOnDestroy() {
    if (this.dSub) this.dSub.unsubscribe();
  }

  cancel() {
    console.log('isDelete')

    this.sharedService.updateDataDel(false);
  }

  delete() {
    this.dSub = this.sharedService.delete(this.elemIn).subscribe({
      next: (message) => {
        MaterialService.toast(message.message);
        void this.router.navigate(['st/assortment']);
      },
      error: (error) => MaterialService.toast(error.error.message()),
    });
  }
}
