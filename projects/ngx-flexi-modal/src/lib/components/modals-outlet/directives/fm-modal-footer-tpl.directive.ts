import {Directive, inject, TemplateRef} from '@angular/core';
import { FmModal } from '../../../models/fm-modal';

interface IFmModalFooterTplDirectiveContext<ModalT extends FmModal = FmModal> {
  $actionsTpl: TemplateRef<void>;
  $theme: string;
  $data: Record<string, unknown>;
  $modal: ModalT;
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
