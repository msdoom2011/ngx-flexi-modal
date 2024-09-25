import {Directive, inject, TemplateRef} from "@angular/core";

interface IFlexiModalActionTplDirectiveContext {
  $id: string;
  $label: string;
  $icon: string | undefined;
  $disabled: boolean;
  $primary: boolean;
  $theme: string;
  $classes: string;
  $onClick: ($event: MouseEvent) => void;
}

@Directive({
  selector: '[fmModalActionTpl]',
  standalone: true,
})
export class FlexiModalActionTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FlexiModalActionTplDirective,
    ctx: any
  ): ctx is IFlexiModalActionTplDirectiveContext {
    return true;
  }
}
