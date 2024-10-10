import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FlexiModalsThemeService } from '../../../../../services/theme/flexi-modals-theme.service';
import { FmModalsOutletComponent } from '../../../fm-modals-outlet.component';
import { FM_MODAL_INSTANCE } from '../../fm-modal-instance.providers';
import { FmModalInstance } from '../../fm-modal-instance';
import { FmModal } from '../../../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance-header',
  standalone: true,
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './fm-modal-instance-header.component.html',
  styleUrl: './fm-modal-instance-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'modal-header',
  },
})
export class FmModalInstanceHeaderComponent {

  // Dependencies
  private readonly _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly modalHeaderTpl = this._outlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
