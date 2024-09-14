import {ChangeDetectionStrategy, Component} from '@angular/core';

import {FlexiModalSection} from "../flexi-modal-section";

@Component({
  selector: 'fm-modal-buttons',
  standalone: true,
  templateUrl: '../flexi-modal-section.html',
  styleUrl: '../flexi-modal-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalButtonsComponent extends FlexiModalSection {}
