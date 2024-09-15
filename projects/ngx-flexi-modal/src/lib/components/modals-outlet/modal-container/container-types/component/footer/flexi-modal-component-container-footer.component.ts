import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalComponent} from "../../../../../../modals/flexi-modal-component";
import {IFlexiModalButtonConfig} from "../../../../../../flexi-modals.models";
import {FlexiModalButton} from "../../../../../../modals/buttons/flexi-modal-button";


@Component({
  selector: 'fm-modal-component-container-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-component-container-footer.component.html',
  styleUrl: './flexi-modal-component-container-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponentContainerFooterComponent {

  // Inputs
  public modal = input.required<FlexiModalComponent>();


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
      'fm-modal-button',
      'button-position-' + buttonConfig.position,
      'button-theme-' + buttonConfig.theme,
      buttonConfig.disabled ? 'disabled' : '',
      ...(buttonConfig.classes || []),
    ]
      .filter(Boolean);
  }
}
