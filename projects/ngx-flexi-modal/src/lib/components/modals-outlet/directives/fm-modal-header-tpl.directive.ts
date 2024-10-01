import {Directive, inject, TemplateRef} from '@angular/core';

interface IFmModalHeaderTplDirectiveContext {
  $title: string;
  $theme: string;
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
