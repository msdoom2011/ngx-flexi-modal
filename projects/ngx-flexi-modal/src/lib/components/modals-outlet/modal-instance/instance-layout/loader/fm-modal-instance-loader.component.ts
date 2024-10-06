import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FmLinearDashedSpinnerComponent } from './spinners/linear-dashed-spinner/fm-linear-dashed-spinner.component';
import { FmLinearDottedSpinnerComponent } from './spinners/linear-dotted-spinner/fm-linear-dotted-spinner.component';
import { FmRoundDottedSpinnerComponent } from './spinners/round-dotted-spinner/fm-round-dotted-spinner.component';
import { FmRoundDashedSpinnerComponent } from './spinners/round-dashed-spinner/fm-round-dashed-spinner.component';
import { FlexiModalsThemeService } from '../../../../../services/theme/flexi-modals-theme.service';
import { FmModalsOutletComponent } from '../../../fm-modals-outlet.component';
import { FM_MODAL_INSTANCE } from '../../fm-modal-instance.providers';
import { FmModalInstance } from '../../fm-modal-instance';
import { FmModal } from '../../../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance-loader',
  standalone: true,
  imports: [
    FmRoundDottedSpinnerComponent,
    FmRoundDashedSpinnerComponent,
    FmLinearDottedSpinnerComponent,
    FmLinearDashedSpinnerComponent,
    NgTemplateOutlet
  ],
  templateUrl: './fm-modal-instance-loader.component.html',
  styleUrl: './fm-modal-instance-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalInstanceLoaderComponent {

  // Dependencies
  private readonly _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly spinnerTpl = this._outlet.modalSpinnerTpl;
  public readonly globalThemeName = this._themes.themeName;
}
