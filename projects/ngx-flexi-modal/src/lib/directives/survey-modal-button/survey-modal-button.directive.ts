import {ChangeDetectionStrategy, Directive, inject, input, TemplateRef} from "@angular/core";

import {SURVEY_MODAL_OPTIONS_DEFAULT} from "./survey-modal-button.constants";
import {ISurveyModalButtonOptions} from "./survey-modal-button.models";
import {generateRandomId} from "../../../../tools/utils";

@Directive({
  selector: '[swModalButton]',
  exportAs: 'swModalButton',
  standalone: true,
})
export class SurveyModalButtonDirective {

  // Dependencies
  public templateRef = inject(TemplateRef);

  // Private props
  public id = 'sw-modal-button-' + generateRandomId();

  // Inputs
  public options = input<
    ISurveyModalButtonOptions,
    Partial<ISurveyModalButtonOptions> | boolean | string
  >(SURVEY_MODAL_OPTIONS_DEFAULT, {
    alias: 'swModalButton',
    transform: (optionsOrVisible) => this._normalizeOptions(optionsOrVisible),
  });


  // Private implementation

  private _normalizeOptions(
    optionsOrVisible: Partial<ISurveyModalButtonOptions> | boolean | string
  ): ISurveyModalButtonOptions {

    const options: Partial<ISurveyModalButtonOptions> = (
      typeof optionsOrVisible === 'boolean'
        ? { visible: optionsOrVisible }
        : (
          !!optionsOrVisible
          && typeof optionsOrVisible === 'object'
          && optionsOrVisible.constructor === Object
        )
          ? optionsOrVisible
          : {}
    );

    return <ISurveyModalButtonOptions>{
      ...SURVEY_MODAL_OPTIONS_DEFAULT,
      ...options,
    };
  }
}
