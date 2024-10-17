import {Directive, inject, TemplateRef} from '@angular/core';
import { FmModal } from '../../../models/fm-modal';

interface IFmModalActionTplDirectiveContext<ModalT extends FmModal = FmModal> {
  $id: string;
  $label: string;
  $icon: string | undefined;
  $disabled: boolean;
  $primary: boolean;
  $classes: string;
  $onClick: ($event: MouseEvent) => void;
  $theme: string;
  $data: Record<string, unknown>;
  $modal: ModalT;
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
