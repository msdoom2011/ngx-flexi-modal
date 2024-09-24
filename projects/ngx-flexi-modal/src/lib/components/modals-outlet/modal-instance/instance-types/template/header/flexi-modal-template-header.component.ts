import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalWithTemplate} from "../../../../../../models/flexi-modal-with-template";

@Component({
  selector: 'fm-modal-template-header',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-template-header.component.html',
  styleUrl: './flexi-modal-template-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalTemplateHeaderComponent {

  // Inputs
  public modal = input.required<FlexiModalWithTemplate>();
}
