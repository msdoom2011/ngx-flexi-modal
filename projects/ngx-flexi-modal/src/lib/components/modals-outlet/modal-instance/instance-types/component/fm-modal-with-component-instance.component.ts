import {AfterViewInit, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {SIGNAL} from '@angular/core/primitives/signals';
import {NgComponentOutlet} from '@angular/common';

import {FmModalInstanceHeaderComponent} from '../../instance-layout/header/fm-modal-instance-header.component';
import {FmModalInstanceFooterComponent} from '../../instance-layout/footer/fm-modal-instance-footer.component';
import {FmModalInstanceLayoutComponent} from '../../instance-layout/fm-modal-instance-layout.component';
import {FmModalWithComponentHeaderComponent} from './header/fm-modal-with-component-header.component';
import {FmModalWithComponentFooterComponent} from './footer/fm-modal-with-component-footer.component';
import {FmModalWithComponent} from '../../../../../models/fm-modal-with-component';
import {IFlexiModalAware} from '../../../../../services/modals/flexi-modals.definitions';
import {FmModalInstance} from '../../fm-modal-instance';

@Component({
  selector: 'fm-modal-with-component-instance',
  templateUrl: './fm-modal-with-component-instance.component.html',
  styleUrl: '../../fm-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FmModalInstanceLayoutComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceFooterComponent,
    FmModalWithComponentHeaderComponent,
    FmModalWithComponentFooterComponent,
    NgComponentOutlet,
  ],
})
export class FmModalWithComponentInstanceComponent<ComponentT extends Partial<IFlexiModalAware>>
extends FmModalInstance<FmModalWithComponent<ComponentT, any>>
implements AfterViewInit {

  public readonly modal = input.required<FmModalWithComponent<ComponentT>>();

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
