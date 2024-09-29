import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalWithTemplate} from "../../../../../../models/flexi-modal-with-template";

@Component({
  selector: 'fm-modal-with-template-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-with-template-footer.component.html',
  styleUrl: './flexi-modal-with-template-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalWithTemplateFooterComponent {

  // Inputs
  public readonly modal = input.required<FlexiModalWithTemplate>();

  // Callbacks

  public onActionContainerClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }
}