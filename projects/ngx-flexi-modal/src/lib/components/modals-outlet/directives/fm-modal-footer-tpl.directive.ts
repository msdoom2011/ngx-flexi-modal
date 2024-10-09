import {Directive, inject, TemplateRef} from '@angular/core';

interface IFmModalFooterTplDirectiveContext {
  $actionsTpl: TemplateRef<void>;
  $theme: string;
  $data: Record<string, unknown>;
}

@Directive({
  selector: '[fmModalFooterTpl]',
  standalone: true,
})
export class FmModalFooterTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FmModalFooterTplDirective,
    ctx: any
  ): ctx is IFmModalFooterTplDirectiveContext {
    return true;
  }
}
