import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalWithComponent} from "../../../../../../modals/flexi-modal-with-component";
import {FlexiButtonComponent} from "../../../../../common/button/flexi-button.component";
import {FlexiModalAction} from "../../../../../../modals/actions/flexi-modal-action";
import {IFlexiModalActionConfig} from "../../../../../../flexi-modals.models";

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

  public onButtonClick($event: MouseEvent, actionConfig: IFlexiModalActionConfig): void {
    const modal = this.modal();

    if (!!actionConfig.onClick) {
      actionConfig.onClick($event, new FlexiModalAction(modal, actionConfig));
    }

    if (actionConfig.closeOnClick) {
      modal.close();
    }
  }


  // Methods

  public getButtonClasses(actionConfig: IFlexiModalActionConfig): Array<string> {
    return [
      actionConfig.position,
      actionConfig.disabled ? 'disabled' : '',
      ...(actionConfig.classes || []),
    ]
      .filter(Boolean);
  }
}
