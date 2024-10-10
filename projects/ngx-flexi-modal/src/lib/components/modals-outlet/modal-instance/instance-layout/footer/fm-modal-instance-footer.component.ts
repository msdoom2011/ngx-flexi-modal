import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FlexiModalsThemeService } from '../../../../../services/theme/flexi-modals-theme.service';
import { FmModalsOutletComponent } from '../../../fm-modals-outlet.component';
import { FmModalInstanceFooterActionsComponent } from './actions/fm-modal-instance-footer-actions.component';
import { FM_MODAL_INSTANCE } from '../../fm-modal-instance.providers';
import { FmModalInstance } from '../../fm-modal-instance';
import { FmModal } from '../../../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FmModalInstanceFooterActionsComponent,
  ],
  templateUrl: './fm-modal-instance-footer.component.html',
  styleUrl: './fm-modal-instance-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'modal-footer',
  },
})
export class FmModalInstanceFooterComponent {

  // Dependencies
  private readonly _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly modalFooterTpl = this._outlet.modalFooterTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
