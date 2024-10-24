import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TFmModalBasicAlign, TFmModalBasicIcon } from '../../fm-modal-basic.definitions';
import { FmWarningIconComponent } from '../modal-icons/fm-warning-icon.component';
import { FmSuccessIconComponent } from '../modal-icons/fm-success-icon.component';
import { FmConfirmIconComponent } from '../modal-icons/fm-confirm-icon.component';
import { FmErrorIconComponent } from '../modal-icons/fm-error-icon.component';
import { FmInfoIconComponent } from '../modal-icons/fm-info-icon.component';
import { IFmModalAware } from '../../../../components/fm-modal.abstract';
import { FmModal } from '../../../../models/fm-modal';

@Component({
  selector: 'fm-modal-basic',
  standalone: true,
  imports: [
    FmErrorIconComponent,
    FmWarningIconComponent,
    FmSuccessIconComponent,
    FmInfoIconComponent,
    FmConfirmIconComponent
  ],
  templateUrl: './fm-modal-basic.component.html',
  styleUrl: './fm-modal-basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalBasicComponent implements IFmModalAware {

  // Inputs
  public readonly modal = input<FmModal | null>();
  public readonly icon = input<TFmModalBasicIcon>();
  public readonly message = input.required<Array<string>, string | Array<string>>({
    transform: value => typeof value === 'string' ? [value] : value
  });
  public readonly messageAlign = input<TFmModalBasicAlign, TFmModalBasicAlign>('left', {
    transform: value => value || 'left'
  });
}
