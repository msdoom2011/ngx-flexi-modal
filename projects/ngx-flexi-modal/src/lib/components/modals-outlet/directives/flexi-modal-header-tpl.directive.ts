import {Directive, inject, TemplateRef} from "@angular/core";

interface IFlexiModalHeaderTplDirectiveContext {
  $title: string;
  $theme: string;
}

@Directive({
  selector: '[fmModalHeaderTpl]',
  standalone: true,
})
export class FlexiModalHeaderTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FlexiModalHeaderTplDirective,
    ctx: any
  ): ctx is IFlexiModalHeaderTplDirectiveContext {
    return true;
  }
}
