import {Directive, inject, TemplateRef} from '@angular/core';

interface IFmModalActionTplDirectiveContext {
  $id: string;
  $label: string;
  $icon: string | undefined;
  $disabled: boolean;
  $primary: boolean;
  $classes: string;
  $onClick: ($event: MouseEvent) => void;
  $theme: string;
  $data: Record<string, unknown>;
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
