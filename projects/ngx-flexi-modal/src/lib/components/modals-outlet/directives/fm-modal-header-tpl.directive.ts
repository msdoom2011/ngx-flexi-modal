import {Directive, inject, TemplateRef} from '@angular/core';
import { FmModal } from '../../../models/fm-modal';

interface IFmModalHeaderTplDirectiveContext<ModalT extends FmModal = FmModal> {
  $title: string;
  $theme: string;
  $data: Record<string, unknown>;
  $modal: ModalT;
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
