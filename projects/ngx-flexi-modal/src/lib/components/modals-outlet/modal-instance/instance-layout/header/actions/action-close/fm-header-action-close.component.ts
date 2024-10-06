import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FmHeaderAction } from '../fm-header-action';

@Component({
  selector: 'fm-header-action-close',
  templateUrl: './fm-header-action-close.component.html',
  styleUrls: [
    '../fm-header-action.scss',
    './fm-header-action-close.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    'data-cy': 'modal-close-btn',
  }
})
export class FmHeaderActionCloseComponent extends FmHeaderAction {

  public override doAction() {
    this.modal().close();
  }
}
