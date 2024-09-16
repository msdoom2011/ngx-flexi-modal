import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalWithTemplate} from "../../../../../../modals/flexi-modal-with-template";

@Component({
  selector: 'fm-modal-template-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-template-footer.component.html',
  styleUrl: './flexi-modal-template-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalTemplateFooterComponent {

  // Inputs
  public modal = input.required<FlexiModalWithTemplate>();

  // Callbacks

  public onButtonTplClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }
}