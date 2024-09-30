import {Component, computed, input} from '@angular/core';

import {TFmModalHeaderActionsPosition} from "../../../../../../services/theme/flexi-modals-theme.definitions";
import {getHeaderActionAnimation, getHeaderActionsAnimation} from "./fm-header-actions.animations";
import {FM_MODAL_HEADER_ACTION_CLASS} from "../../fm-modal-instance-layout.constants";
import {FmModal} from "../../../../../../models/fm-modal";

@Component({
  selector: 'fm-header-actions',
  standalone: true,
  imports: [],
  templateUrl: './fm-header-actions.component.html',
  styleUrl: './fm-header-actions.component.scss',
  host: {
    'class': 'fm-modal--header-actions',
    '[class]': '"position-" + position()',
    '[class.maximized]': 'modal().maximized()',
    '[class.outside-corner]': '!modal().config().maximizable && modal().config().closable',
    '[@fadeInOutActions]': 'position()'
  },
  animations: [
    getHeaderActionsAnimation('fadeInOutActions'),
    getHeaderActionAnimation('showHeaderAction'),
  ]
})
export class FmHeaderActionsComponent {

  // Inputs
  public modal = input.required<FmModal>();


  // Computed

  public readonly position = computed<TFmModalHeaderActionsPosition>(() => {
    return !this.modal().maximized()
      ? <TFmModalHeaderActionsPosition>this.modal().theme().styling.headerActions
      : 'inside';
  });

  public readonly headerActionClasses = computed<Array<string>>(() => {
    return [
      FM_MODAL_HEADER_ACTION_CLASS,
      ...(!this.modal().theme().styling.headerActionsWithBg ? ['no-background'] : []),
    ];
  });
}
