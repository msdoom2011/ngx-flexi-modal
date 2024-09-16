import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalWithComponent} from "../../../../../../modals/flexi-modal-with-component";
import {FlexiButtonComponent} from "../../../../../common/button/flexi-button.component";
import {FlexiModalButton} from "../../../../../../modals/buttons/flexi-modal-button";
import {IFlexiModalButtonConfig} from "../../../../../../flexi-modals.models";

@Component({
  selector: 'fm-modal-component-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FlexiButtonComponent,
  ],
  templateUrl: './flexi-modal-component-footer.component.html',
  styleUrl: './flexi-modal-component-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponentFooterComponent {

  // Inputs
  public modal = input.required<FlexiModalWithComponent>();


  // Callbacks

  public onButtonClick($event: MouseEvent, buttonConfig: IFlexiModalButtonConfig): void {
    const modal = this.modal();

    if (!!buttonConfig.onClick) {
      buttonConfig.onClick($event, new FlexiModalButton(modal, buttonConfig));
    }

    if (buttonConfig.closeOnClick) {
      modal.close();
    }
  }


  // Methods

  public getButtonClasses(buttonConfig: IFlexiModalButtonConfig): Array<string> {
    return [
      buttonConfig.position,
      buttonConfig.disabled ? 'disabled' : '',
      ...(buttonConfig.classes || []),
    ]
      .filter(Boolean);
  }
}
