import {AfterViewInit, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {FlexiModalComponentContainerHeaderComponent} from "./header/flexi-modal-component-container-header.component";
import {FlexiModalComponentContainerFooterComponent} from "./footer/flexi-modal-component-container-footer.component";
import {FlexiModalLayoutHeaderComponent} from "../../container-layout/header/flexi-modal-layout-header.component";
import {FlexiModalLayoutFooterComponent} from "../../container-layout/footer/flexi-modal-layout-footer.component";
import {FlexiModalLayoutComponent} from "../../container-layout/flexi-modal-layout.component";
import {FlexiModalComponent} from "../../../../../modals/flexi-modal-component";
import {FlexiModalContainer} from "../../flexi-modal-container";

@Component({
  selector: 'fm-modal-component-container',
  templateUrl: './flexi-modal-component-container.component.html',
  styleUrl: '../../flexi-modal-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalLayoutComponent,
    FlexiModalLayoutHeaderComponent,
    FlexiModalLayoutFooterComponent,
    FlexiModalComponentContainerHeaderComponent,
    FlexiModalComponentContainerFooterComponent,
    NgComponentOutlet,
  ],
})
export class FlexiModalComponentContainerComponent<ComponentT>
extends FlexiModalContainer<FlexiModalComponent<ComponentT, any>>
implements AfterViewInit {

  public override modal = input.required<FlexiModalComponent<ComponentT>>();

  public ngAfterViewInit() {
    const content$ = this.modal().content$;
    const componentRef = this.contentRef()?.createComponent(this.modal().content, { injector: this._injector });
    const componentInputs = this.modal().config.inputs;

    if (componentRef && componentInputs) {
      for (const inputName in componentInputs) {
        if (componentInputs.hasOwnProperty(inputName)) {
          componentRef.setInput(inputName, componentInputs[inputName]);
        }
      }
    }

    content$.next(componentRef || null);
    content$.complete();
  }
}
