import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {IFlexiModalAware, FmModalWithComponent} from "ngx-flexi-modal";

@Component({
  selector: 'fm-app-modal-aware',
  standalone: true,
  imports: [],
  templateUrl: './modal-aware.component.html',
  styleUrl: './modal-aware.component.scss'
})
export class ModalAwareComponent implements OnInit, OnDestroy, IFlexiModalAware {

  public modal = input<FmModalWithComponent>();

  public ngOnInit() {
    console.log('SERVICE MODAL INITIALIZED!!!');
    console.log('MODAL INSTANCE: ', this.modal());
  }

  public ngOnDestroy(): void {
    console.log('SERVICE MODAL DESTROYED!!!');
  }
}
