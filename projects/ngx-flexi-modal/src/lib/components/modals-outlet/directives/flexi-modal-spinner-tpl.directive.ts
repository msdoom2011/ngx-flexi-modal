import {Directive, inject, TemplateRef} from "@angular/core";

import {TFlexiModalSpinnerType} from "../../../services/theme/flexi-modals-theme.definitions";

interface IFlexiModalSpinnerTplDirectiveContext {
  $type: TFlexiModalSpinnerType;
  $theme: string;
}

@Directive({
  selector: '[fmModalSpinnerTpl]',
  standalone: true,
})
export class FlexiModalSpinnerTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FlexiModalSpinnerTplDirective,
    ctx: any
  ): ctx is IFlexiModalSpinnerTplDirectiveContext {
    return true;
  }
}
