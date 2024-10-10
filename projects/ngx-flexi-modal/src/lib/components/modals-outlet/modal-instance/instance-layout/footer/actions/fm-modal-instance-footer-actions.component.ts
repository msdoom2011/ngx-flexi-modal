import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FlexiModalsThemeService } from '../../../../../../services/theme/flexi-modals-theme.service';
import { IFmModalActionConfig } from '../../../../../../services/modals/flexi-modals.definitions';
import { FmModalsOutletComponent } from '../../../../fm-modals-outlet.component';
import { FmModalAction } from '../../../../../../models/actions/fm-modal-action';
import { FM_MODAL_INSTANCE } from '../../../fm-modal-instance.providers';
import { FmModalInstance } from '../../../fm-modal-instance';
import { FmModal } from '../../../../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance-footer-actions',
  templateUrl: './fm-modal-instance-footer-actions.component.html',
  styleUrl: './fm-modal-instance-footer-actions.component.scss',
  standalone: true,
  imports: [ NgTemplateOutlet ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fm-modal-footer--actions',
    'data-cy': 'modal-footer-actions',
  }
})
export class FmModalInstanceFooterActionsComponent {

  // Dependencies
  private readonly _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly actionButtonTpl = this._outlet.modalActionTpl;
  public readonly themeNameGlobal = this._themes.themeName;


  // Callbacks

  public onActionClick(actionConfig: IFmModalActionConfig, $event: MouseEvent): void {
    const modal = this.modal();

    actionConfig.onClick?.($event, new FmModalAction(modal, actionConfig));

    if (actionConfig.closeOnClick) {
      modal.close();
    }
  }

  public onActionContainerClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }


  // Methods

  public getButtonClasses(actionConfig: IFmModalActionConfig): Array<string> {
    return [
      actionConfig.position,
      actionConfig.disabled ? 'disabled' : '',
      actionConfig.primary ? 'primary' : '',
      ...(actionConfig.classes || []),
    ]
      .filter(Boolean)
  }
}
