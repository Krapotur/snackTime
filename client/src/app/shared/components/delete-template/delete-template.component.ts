import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatFabButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {Elem} from "../../interfaces";
import {SharedDelService} from "../../services/shared-del.service";
import {Subscription} from "rxjs";
import {MaterialService} from "../../classes/material.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-template',
  standalone: true,
  imports: [
    MatFabButton,
    NgIf
  ],
  templateUrl: './delete-template.component.html',
  styleUrl: './delete-template.component.scss'
})
export class DeleteTemplateComponent implements OnInit, OnDestroy {
  private sharedService = inject(SharedDelService)
  private router =  inject(Router)

  title = ''
  dSub: Subscription

  @Input() elemIn: Elem

  ngOnInit() {
    this.title = this.elemIn.title
  }

  ngOnDestroy() {
    if (this.dSub) this.dSub.unsubscribe()
  }

  openPage() {
    this.router.navigateByUrl('/').then(() => {
      void this.router.navigate([`st/form-${this.elemIn.formRoute}/${this.elemIn.id}`])
    })
  }

  delete() {
    this.dSub = this.sharedService.delete(this.elemIn).subscribe({
      next: message => {
        MaterialService.toast(message.message)
        void this.router.navigate([`admin/${this.elemIn.route}`])
      },
      error: error => MaterialService.toast(error.error.message())
    })
  }

}
