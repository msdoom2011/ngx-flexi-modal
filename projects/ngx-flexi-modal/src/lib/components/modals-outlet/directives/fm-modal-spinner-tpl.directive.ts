import {Directive, inject, TemplateRef} from '@angular/core';

import { TFmModalSpinnerType } from '../../../services/modals/flexi-modals.definitions';

interface IFmModalSpinnerTplDirectiveContext {
  $type: TFmModalSpinnerType;
  $theme: string;
  $data: Record<string, unknown>;
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
