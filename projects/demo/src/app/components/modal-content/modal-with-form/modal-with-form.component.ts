import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  FmModalAbstract,
  FmModalActionDirective,
  FmModalFooterDirective,
  FmModalHeaderDirective,
  FlexiModalsService,
} from 'ngx-flexi-modal';

@Component({
  selector: 'fm-app-modal-with-form',
  standalone: true,
  imports: [
    FmModalActionDirective,
    FmModalHeaderDirective,
    FmModalFooterDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './modal-with-form.component.html',
  styleUrl: './modal-with-form.component.scss'
})
export class ModalWithFormComponent extends FmModalAbstract implements OnInit, OnDestroy {

  private modals = inject(FlexiModalsService);

  public ngOnInit() {
    console.log('SERVICE MODAL INITIALIZED!!!');
    console.log('MODAL INSTANCE: ', this.modal());

    setTimeout(() => {
      this.modals.open('info', {
        message: 'This is an information modal!'
      });
    }, 1000);
  }

  public ngOnDestroy(): void {
    console.log('SERVICE MODAL DESTROYED!!!');
  }

  public onClick(): void {
    this.modals.open('error', {
      message: 'MESSAGE TEXT!!!'
    });
  }
}
