import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalTemplate} from "../../../../../../modals/flexi-modal-template";

@Component({
  selector: 'fm-modal-template-container-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-template-container-footer.component.html',
  styleUrl: './flexi-modal-template-container-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalTemplateContainerFooterComponent {

  // Inputs
  public modal = input.required<FlexiModalTemplate>();

  // Callbacks

  public onButtonTplClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }
}
