import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalButton} from "../../../../../../modals/buttons/flexi-modal-button";
import {FlexiModalWithComponent} from "../../../../../../modals/flexi-modal-with-component";
import {IFlexiModalButtonConfig} from "../../../../../../flexi-modals.models";

@Component({
  selector: 'fm-modal-component-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
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
      'fm-modal-button',
      'button-position-' + buttonConfig.position,
      'button-theme-' + buttonConfig.theme,
      buttonConfig.disabled ? 'disabled' : '',
      ...(buttonConfig.classes || []),
    ]
      .filter(Boolean);
  }
}
