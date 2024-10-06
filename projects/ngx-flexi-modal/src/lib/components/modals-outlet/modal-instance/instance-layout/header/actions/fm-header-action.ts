import { computed, Directive, inject } from '@angular/core';

import { FM_MODAL_HEADER_ACTION_CLASS } from '../../fm-modal-instance-layout.constants';
import { FmHeaderActionsComponent } from './fm-header-actions.component';

@Directive({
  standalone: true,
  host: {
    'tabindex': '0',
    '[class]': 'hostClasses()',
    '[class.no-background]': '!this.modal().theme().styling.headerActionsWithBg',
    '[class.maximized]': 'modal().maximized()',
    '(keydown.enter)': 'doAction()',
    '(keydown.space)': 'doAction()',
    '(click)': 'doAction()',
  },
})
export abstract class FmHeaderAction {

  // Dependencies
  public container = inject(FmHeaderActionsComponent);

  // Signals
  public position = this.container.position;
  public modal = this.container.modal;


  // Computed

  public readonly hostClasses = computed<Array<string>>(() => {
    return [
      FM_MODAL_HEADER_ACTION_CLASS,
      'position-' + this.position(),
    ];
  });


  // Public methods

  public abstract doAction(): void;
}
