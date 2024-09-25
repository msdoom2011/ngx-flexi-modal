import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {TFlexiModalBasicAlign, TFlexiModalBasicIcon} from "../../flexi-modal-basic.definitions";
import {WarningIconComponent} from "../modal-icons/warning-icon.component";
import {SuccessIconComponent} from "../modal-icons/success-icon.component";
import {ConfirmIconComponent} from "../modal-icons/confirm-icon.component";
import {ErrorIconComponent} from "../modal-icons/error-icon.component";
import {InfoIconComponent} from "../modal-icons/info-icon.component";

@Component({
  selector: 'fm-modal-basic',
  standalone: true,
  imports: [
    ErrorIconComponent,
    WarningIconComponent,
    SuccessIconComponent,
    InfoIconComponent,
    ConfirmIconComponent
  ],
  templateUrl: './flexi-modal-basic.component.html',
  styleUrl: './flexi-modal-basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalBasicComponent {

  // Inputs
  public readonly icon = input<TFlexiModalBasicIcon>();
  public readonly message = input.required<Array<string>, string | Array<string>>({
    transform: value => typeof value === 'string' ? [value] : value
  });
  public readonly messageAlign = input<TFlexiModalBasicAlign, TFlexiModalBasicAlign>('left', {
    transform: value => value || 'left'
  });
}
