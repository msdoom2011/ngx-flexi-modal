import {Directive, inject, TemplateRef} from "@angular/core";

import {TFmModalSpinnerType} from "../../../services/theme/flexi-modals-theme.definitions";

interface IFmModalSpinnerTplDirectiveContext {
  $type: TFmModalSpinnerType;
  $theme: string;
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
