import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FmModalWithTemplate} from "../../../../../../models/fm-modal-with-template";

@Component({
  selector: 'fm-modal-with-template-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './fm-modal-with-template-footer.component.html',
  styleUrl: './fm-modal-with-template-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalWithTemplateFooterComponent {

  // Inputs
  public readonly modal = input.required<FmModalWithTemplate>();

  // Callbacks

  public onActionContainerClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }
}
