import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

import { FmModalWithTemplateInstanceComponent } from '../fm-modal-with-template-instance.component';

@Component({
  selector: 'fm-modal-with-template-footer',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './fm-modal-with-template-footer.component.html',
  styleUrl: './fm-modal-with-template-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'modal-footer',
  }
})
export class FmModalWithTemplateFooterComponent {

  // Dependencies
  private readonly _instance = inject(FmModalWithTemplateInstanceComponent);

  // Signals
  public readonly modal = this._instance.modal;


  // Callbacks

  public onActionContainerClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }
}
