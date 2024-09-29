import {Directive, inject, TemplateRef} from "@angular/core";

interface IFmModalActionTplDirectiveContext {
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
export class FmModalActionTplDirective {

  public readonly templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FmModalActionTplDirective,
    ctx: any
  ): ctx is IFmModalActionTplDirectiveContext {
    return true;
  }
}
