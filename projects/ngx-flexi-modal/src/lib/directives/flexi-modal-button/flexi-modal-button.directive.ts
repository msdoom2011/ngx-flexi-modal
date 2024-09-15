import {Directive, inject, input, TemplateRef} from "@angular/core";

import {FLEXI_MODAL_OPTIONS_DEFAULT} from "./flexi-modal-button.constants";
import {IFlexiModalButtonOptions} from "./flexi-modal-button.models";
import {generateRandomId, isPlainObject} from "../../tools/utils";

@Directive({
  selector: '[fmModalButton]',
  exportAs: 'fmModalButton',
  standalone: true,
})
export class FlexiModalButtonDirective {

  // Dependencies
  public templateRef = inject(TemplateRef);

  // Private props
  public id = 'fm-modal-button-' + generateRandomId();

  // Inputs
  public options = input<
    IFlexiModalButtonOptions,
    Partial<IFlexiModalButtonOptions> | boolean | string
  >(FLEXI_MODAL_OPTIONS_DEFAULT, {
    alias: 'swModalButton',
    transform: (optionsOrVisible) => this._normalizeOptions(optionsOrVisible),
  });


  // Private implementation

  private _normalizeOptions(
    optionsOrVisible: Partial<IFlexiModalButtonOptions> | boolean | string
  ): IFlexiModalButtonOptions {

    const options: Partial<IFlexiModalButtonOptions> = (
      typeof optionsOrVisible === 'boolean'
        ? { visible: optionsOrVisible }
        : isPlainObject(optionsOrVisible)
          ? optionsOrVisible
          : {}
    );

    return <IFlexiModalButtonOptions>{
      ...FLEXI_MODAL_OPTIONS_DEFAULT,
      ...options,
    };
  }
}
