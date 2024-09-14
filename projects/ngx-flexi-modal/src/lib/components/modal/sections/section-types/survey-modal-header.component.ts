import {ChangeDetectionStrategy, Component} from '@angular/core';

import {SurveyModalSectionComponent} from "../survey-modal-section.component";

@Component({
  selector: 'sw-modal-header',
  standalone: true,
  templateUrl: '../survey-modal-section.component.html',
  styleUrl: '../survey-modal-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyModalHeaderComponent extends SurveyModalSectionComponent {}
