import {Component, input, OnInit} from '@angular/core';
import {FlexiModalHeaderComponent, FlexiModalWithComponent, IFlexiModalAware} from "ngx-flexi-modal";

@Component({
  selector: 'app-modal-aware',
  standalone: true,
  imports: [
    FlexiModalHeaderComponent,
  ],
  templateUrl: './modal-aware.component.html',
  styleUrl: './modal-aware.component.scss'
})
export class ModalAwareComponent implements OnInit, IFlexiModalAware {

  public modal = input.required<FlexiModalWithComponent>();

  public ngOnInit() {
    console.log(this.modal());
  }
}
