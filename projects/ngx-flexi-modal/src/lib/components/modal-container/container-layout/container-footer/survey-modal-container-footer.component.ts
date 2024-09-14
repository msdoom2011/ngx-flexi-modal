import {ChangeDetectionStrategy, Component, input, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {SurveyModalButtonDirective} from "../../../../directives/survey-modal-button/survey-modal-button.directive";
import {SurveyModalContainerComponent} from "../../survey-modal-container.component";
import {ISurveyModalButtonConfig} from "../../../../survey-modals.models";
import {SurveyModalButton} from "../../survey-modal-button";

@Component({
  selector: 'sw-modal-container-footer',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './survey-modal-container-footer.component.html',
  styleUrl: './survey-modal-container-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyModalContainerFooterComponent {

  // Inputs
  public modal = input.required<SurveyModalContainerComponent<any, any>>();
  public contentTpl = input<TemplateRef<any>>();
  public buttons = input<Array<ISurveyModalButtonConfig>>();
  public buttonsTpl = input<Array<SurveyModalButtonDirective>>();

  // Callbacks

  public onButtonClick($event: MouseEvent, buttonConfig: ISurveyModalButtonConfig): void {
    const modal = this.modal();

    if (!!buttonConfig.onClick) {
      buttonConfig.onClick($event, new SurveyModalButton(modal, buttonConfig));
    }

    if (buttonConfig.closeOnClick) {
      modal.close();
    }
  }

  public onButtonTplClick(closeOnClick: any): void {
    if (closeOnClick) {
      this.modal().close();
    }
  }

  // Methods

  public getButtonClasses(buttonConfig: ISurveyModalButtonConfig): Array<string> {
    return [
      'sw-modal-button',
      'button-position-' + buttonConfig.position,
      'button-theme-' + buttonConfig.theme,
      buttonConfig.disabled ? 'disabled' : '',
      ...(buttonConfig.classes || []),
    ]
      .filter(Boolean);
  }
}
