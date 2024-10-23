import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  FmModalAbstract,
  FmModalActionDirective,
  FmModalFooterDirective,
  FmModalHeaderDirective,
} from 'ngx-flexi-modal';

@Component({
  selector: 'fm-app-modal-aware',
  standalone: true,
  imports: [
    FmModalActionDirective,
    FmModalHeaderDirective,
    FmModalFooterDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './modal-aware.component.html',
  styleUrl: './modal-aware.component.scss'
})
export class ModalAwareComponent extends FmModalAbstract implements OnInit, OnDestroy {

  public ngOnInit() {
    console.log('SERVICE MODAL INITIALIZED!!!');
    console.log('MODAL INSTANCE: ', this.modal());
  }

  public ngOnDestroy(): void {
    console.log('SERVICE MODAL DESTROYED!!!');
  }

  public onClick(): void {
    alert('CLICK!!!');
    this.modal()?.close();
  }
}
