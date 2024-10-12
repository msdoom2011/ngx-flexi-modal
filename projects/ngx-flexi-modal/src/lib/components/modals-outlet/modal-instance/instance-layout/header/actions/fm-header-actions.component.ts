import { Component, computed, inject } from '@angular/core';

import { TFmModalHeaderActionsPosition } from '../../../../../../services/theme/flexi-modals-theme.definitions';
import { FmHeaderActionMaximizeComponent } from './action-maximize/fm-header-action-maximize.component';
import { FmHeaderActionCloseComponent } from './action-close/fm-header-action-close.component';
import { getHeaderActionAnimation } from './fm-header-actions.animations';
import { FM_MODAL_INSTANCE } from '../../../fm-modal-instance.providers';
import { FmModalInstance } from '../../../fm-modal-instance';
import { FmModal } from '../../../../../../models/fm-modal';

@Component({
  selector: 'fm-header-actions',
  standalone: true,
  templateUrl: './fm-header-actions.component.html',
  styleUrl: './fm-header-actions.component.scss',
  imports: [
    FmHeaderActionCloseComponent,
    FmHeaderActionMaximizeComponent,
  ],
  host: {
    'class': 'fm-modal--header-actions',
    '[class]': '"position-" + position()',
    '[class.outside-corner]': '!modal().config().maximizable && modal().config().closable',
  },
  animations: [
    getHeaderActionAnimation('showHeaderAction'),
  ]
})
export class FmHeaderActionsComponent {

  // Dependencies
  private _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);

  // Signals
  public modal = this._instance.modal;


  // Computed

  public readonly position = computed<TFmModalHeaderActionsPosition>(() => {
    return !this.modal().maximized()
      ? <TFmModalHeaderActionsPosition>this.modal().theme().styling.headerActionsPosition
      : 'inside';
  });
}
