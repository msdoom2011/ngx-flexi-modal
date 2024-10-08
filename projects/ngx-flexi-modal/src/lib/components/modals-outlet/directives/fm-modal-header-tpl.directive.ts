import {Directive, inject, TemplateRef} from '@angular/core';

interface IFmModalHeaderTplDirectiveContext {
  $title: string;
  $theme: string;
  $data: Record<string, unknown>;
}

@Directive({
  selector: '[fmModalHeaderTpl]',
  standalone: true,
})
export class FmModalHeaderTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FmModalHeaderTplDirective,
    ctx: any
  ): ctx is IFmModalHeaderTplDirectiveContext {
    return true;
  }
}
