import {Directive, inject, TemplateRef} from "@angular/core";
import {IFlexiModalTheme} from "../../../services/theme/flexi-modals-theme.definitions";

interface IFlexiModalActionButtonDirectiveContext {
  $id: string;
  $label: string;
  $icon: string | undefined;
  $disabled: boolean;
  $primary: boolean;
  $theme: string;
  $classes: Array<string> | undefined;
  $onClick: ($event: MouseEvent) => void;
}

@Directive({
  selector: '[fmActionButton]',
  standalone: true,
})
export class FlexiModalActionButtonDirective {

  public templateRef = inject(TemplateRef);

  static ngTemplateContextGuard(
    dir: FlexiModalActionButtonDirective,
    ctx: any
  ): ctx is IFlexiModalActionButtonDirectiveContext {
    return true;
  }
}
