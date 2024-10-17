import {Directive, inject, TemplateRef} from '@angular/core';

import { TFmModalSpinnerType } from '../../../services/modals/flexi-modals.definitions';
import { FmModal } from '../../../models/fm-modal';

interface IFmModalSpinnerTplDirectiveContext<ModalT extends FmModal = FmModal> {
  $type: TFmModalSpinnerType;
  $theme: string;
  $data: Record<string, unknown>;
  $modal: ModalT;
}

@Directive({
  selector: '[fmModalSpinnerTpl]',
  standalone: true,
})
export class FmModalSpinnerTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FmModalSpinnerTplDirective,
    ctx: any
  ): ctx is IFmModalSpinnerTplDirectiveContext {
    return true;
  }
}
