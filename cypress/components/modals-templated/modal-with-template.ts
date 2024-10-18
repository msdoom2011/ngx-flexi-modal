import { Directive, input, output, viewChild } from '@angular/core';

import { FmModalOpenEvent } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/events/fm-modal-open.event';
import { FmModalComponent } from '../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import {
  TFmModalHeight,
  TFmModalOpeningAnimation,
  TFmModalPosition,
  TFmModalScroll,
  TFmModalSpinnerType,
  TFmModalWidth,
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.definitions';
import {
  FmModalUpdateEvent,
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/events/fm-modal-update.event';
import {
  FmModalCloseEvent,
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/events/fm-modal-close.event';
import {
  FmModalBeforeCloseEvent,
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/events/fm-modal-before-close.event';

@Directive()
export abstract class ModalWithTemplate {

  // Inputs
  public readonly id = input<string | undefined>(undefined);
  public readonly opened = input<boolean>(false);
  public readonly maximized = input<boolean | undefined>(undefined);
  public readonly title = input<string | undefined>(undefined);
  public readonly animation = input<TFmModalOpeningAnimation | undefined>(undefined);
  public readonly position = input<TFmModalPosition | undefined>(undefined);
  public readonly width = input<TFmModalWidth | undefined>(undefined);
  public readonly height = input<TFmModalHeight | undefined>(undefined);
  public readonly scroll = input<TFmModalScroll | undefined>(undefined);
  public readonly spinner = input<TFmModalSpinnerType | undefined>(undefined);
  public readonly closable = input<boolean | undefined>(undefined);
  public readonly maximizable = input<boolean | undefined>(undefined);
  public readonly theme = input<string | undefined>(undefined);
  public readonly data = input<any>(undefined);

  // Outputs
  public readonly change = output<FmModalUpdateEvent>();
  public readonly open = output<FmModalOpenEvent>();
  public readonly close = output<FmModalCloseEvent>();
  public readonly beforeClose = output<FmModalBeforeCloseEvent>();
  public readonly openedChange = output<boolean>();
  public readonly maximizedChange = output<boolean>();

  // Queries
  public readonly modal = viewChild.required<FmModalComponent>('modal');
}
