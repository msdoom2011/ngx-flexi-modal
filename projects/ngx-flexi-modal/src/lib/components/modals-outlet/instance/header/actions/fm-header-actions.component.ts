import { Component, computed, inject } from '@angular/core';

import { TFmModalHeaderActionsPosition } from '../../../../../services/theme/flexi-modals-theme.definitions';
import { FmHeaderActionMaximizeComponent } from './action-maximize/fm-header-action-maximize.component';
import { FmHeaderActionCloseComponent } from './action-close/fm-header-action-close.component';
import { FmModalInstanceComponent } from '../../fm-modal-instance.component';
import { getHeaderActionAnimation } from './fm-header-actions.animations';

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
  private _instance = inject(FmModalInstanceComponent);

  // Signals
  public modal = this._instance.modal;


  // Computed

  public readonly position = computed<TFmModalHeaderActionsPosition>(() => {
    return !this.modal().maximized()
      ? <TFmModalHeaderActionsPosition>this.modal().theme().styling.headerActionsPosition
      : 'inside';
  });
}
