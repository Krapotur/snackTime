import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
  constructor(private sharedService: SharedDelService,
              private router: Router) {
  }

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
      this.router.navigate([`admin/form-restaurant/${this.elemIn.id}`]).then()
    })
  }

  delete() {
    this.dSub = this.sharedService.delete(this.elemIn).subscribe({
      next: message => {
        MaterialService.toast(message.message)
        this.router.navigate([`admin/${this.elemIn.route}`]).then()
      },
      error: error => MaterialService.toast(error.error.message())
    })
  }

}
