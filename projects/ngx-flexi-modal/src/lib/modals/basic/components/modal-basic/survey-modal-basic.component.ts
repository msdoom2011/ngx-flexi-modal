import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {TSurveyModalBasicAlign, TSurveyModalBasicIcon} from "../../survey-modal-basic.models";
import {ModalBasicErrorIconComponent} from "../modal-icons/modal-basic-error-icon.component";
import {ModalBasicWarningIconComponent} from "../modal-icons/modal-basic-warning-icon.component";
import {ModalBasicSuccessIconComponent} from "../modal-icons/modal-basic-success-icon.component";
import {ModalBasicInfoIconComponent} from "../modal-icons/modal-basic-info-icon.component";
import {ModalBasicConfirmIconComponent} from "../modal-icons/modal-basic-confirm-icon.component";

@Component({
  selector: 'sw-modal-basic',
  standalone: true,
  imports: [
    ModalBasicErrorIconComponent,
    ModalBasicWarningIconComponent,
    ModalBasicSuccessIconComponent,
    ModalBasicInfoIconComponent,
    ModalBasicConfirmIconComponent
  ],
  templateUrl: './survey-modal-basic.component.html',
  styleUrl: './survey-modal-basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyModalBasicComponent {

  // Inputs
  public icon = input<TSurveyModalBasicIcon>();
  public message = input.required<Array<string>, string | Array<string>>({
    transform: value => typeof value === 'string' ? [value] : value
  });
  public messageAlign = input<TSurveyModalBasicAlign, TSurveyModalBasicAlign>('left', {
    transform: value => value || 'left'
  });
}
