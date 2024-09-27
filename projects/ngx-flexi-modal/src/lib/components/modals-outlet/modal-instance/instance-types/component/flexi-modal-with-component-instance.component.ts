import {AfterViewInit, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {SIGNAL} from "@angular/core/primitives/signals";
import {NgComponentOutlet} from "@angular/common";

import {FlexiModalInstanceHeaderComponent} from "../../instance-layout/header/flexi-modal-instance-header.component";
import {FlexiModalInstanceFooterComponent} from "../../instance-layout/footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceLayoutComponent} from "../../instance-layout/flexi-modal-instance-layout.component";
import {FlexiModalWithComponentHeaderComponent} from "./header/flexi-modal-with-component-header.component";
import {FlexiModalWithComponentFooterComponent} from "./footer/flexi-modal-with-component-footer.component";
import {FlexiModalWithComponent} from "../../../../../models/flexi-modal-with-component";
import {IFlexiModalAware} from "../../../../../services/modals/flexi-modals.definitions";
import {FlexiModalInstance} from "../../flexi-modal-instance";

@Component({
  selector: 'fm-modal-with-component-instance',
  templateUrl: './flexi-modal-with-component-instance.component.html',
  styleUrl: '../../flexi-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalInstanceLayoutComponent,
    FlexiModalInstanceHeaderComponent,
    FlexiModalInstanceFooterComponent,
    FlexiModalWithComponentHeaderComponent,
    FlexiModalWithComponentFooterComponent,
    NgComponentOutlet,
  ],
})
export class FlexiModalWithComponentInstanceComponent<ComponentT extends Partial<IFlexiModalAware>>
extends FlexiModalInstance<FlexiModalWithComponent<ComponentT, any>>
implements AfterViewInit {

  public readonly modal = input.required<FlexiModalWithComponent<ComponentT>>();

  public ngAfterViewInit() {
    const modal = this.modal();
    const content$ = modal.content$;
    const componentRef = this.contentRef()?.createComponent(modal.content, { injector: this._injector });
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
