import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FmHeaderAction } from '../fm-header-action';

@Component({
  selector: 'fm-header-action-maximize',
  templateUrl: './fm-header-action-maximize.component.html',
  styleUrls: [
    '../fm-header-action.scss',
    './fm-header-action-maximize.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    'data-cy': 'modal-maximize-btn',
  }
})
export class FmHeaderActionMaximizeComponent extends FmHeaderAction {

  public override doAction() {
    this.modal().toggleMaximize();
  }
}
