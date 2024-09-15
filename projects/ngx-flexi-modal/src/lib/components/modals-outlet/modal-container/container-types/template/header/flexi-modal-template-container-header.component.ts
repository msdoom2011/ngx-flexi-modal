import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalTemplate} from "../../../../../../modals/flexi-modal-template";

@Component({
  selector: 'fm-modal-template-container-header',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-template-container-header.component.html',
  styleUrl: './flexi-modal-template-container-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalTemplateContainerHeaderComponent {

  // Imports
  public modal = input.required<FlexiModalTemplate>();
}
