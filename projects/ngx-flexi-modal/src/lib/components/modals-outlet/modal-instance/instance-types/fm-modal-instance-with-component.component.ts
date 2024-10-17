import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';
import { NgComponentOutlet } from '@angular/common';

import { FmModalInstanceHeaderComponent } from '../instance-layout/header/fm-modal-instance-header.component';
import { FmModalInstanceFooterComponent } from '../instance-layout/footer/fm-modal-instance-footer.component';
import { FmModalInstanceLayoutComponent } from '../instance-layout/fm-modal-instance-layout.component';
import { IFlexiModalAware } from '../../../../services/modals/flexi-modals.definitions';
import { FmModalWithComponent } from '../../../../models/fm-modal-with-component';
import { FM_MODAL_INSTANCE } from '../fm-modal-instance.providers';
import { FmModalInstance } from '../fm-modal-instance';

@Component({
  selector: 'fm-modal-instance-with-component',
  templateUrl: '../fm-modal-instance.html',
  styleUrl: '../fm-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FmModalInstanceLayoutComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceFooterComponent,
    NgComponentOutlet,
  ],
  providers: [
    { provide: FM_MODAL_INSTANCE, useExisting: FmModalInstanceWithComponentComponent },
  ],
})
export class FmModalInstanceWithComponentComponent<ComponentT extends Partial<IFlexiModalAware>>
extends FmModalInstance<FmModalWithComponent<ComponentT, any>>
implements AfterViewInit {

  public ngAfterViewInit() {
    const modal = this.modal();
    const content$ = modal.content$;
    const componentRef = this._contentRef()?.createComponent(modal.content, { injector: this._injector });
    const componentInputs = modal.config().inputs;

    if (componentRef?.instance.modal && componentRef.instance.modal[SIGNAL]) {
      componentRef.setInput('modal', modal);
    }

    if (componentRef && componentInputs) {
      for (const inputName in componentInputs) {
        if (Object.hasOwnProperty.call(componentInputs, inputName)) {
          componentRef.setInput(inputName, componentInputs[inputName]);
        }
      }
    }

    content$.next(componentRef || null);
    content$.complete();
  }
}
