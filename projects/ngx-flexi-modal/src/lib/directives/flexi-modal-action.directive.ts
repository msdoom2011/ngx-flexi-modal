import {Directive, inject, input, TemplateRef} from "@angular/core";

import {generateRandomId, isPlainObject} from "../tools/utils";
import {TFlexiModalButtonPosition} from "../flexi-modals.models";

export interface IFlexiModalButtonDirectiveOptions {
  visible?: boolean;
  closeOnClick?: boolean;
  position?: TFlexiModalButtonPosition;
}

const FLEXI_MODAL_OPTIONS_DEFAULT: IFlexiModalButtonDirectiveOptions = {
  visible: true,
  closeOnClick: true,
  position: 'right',
};

@Directive({
  selector: '[fmModalAction]',
  exportAs: 'fmModalAction',
  standalone: true,
})
export class FlexiModalActionDirective {

  // Dependencies
  public templateRef = inject(TemplateRef);

  // Private props
  public id = 'fm-modal-action-' + generateRandomId();

  // Inputs
  public options = input<
    IFlexiModalButtonDirectiveOptions,
    Partial<IFlexiModalButtonDirectiveOptions> | boolean | string
  >(FLEXI_MODAL_OPTIONS_DEFAULT, {
    alias: 'fmModalAction',
    transform: (optionsOrVisible) => this._normalizeOptions(optionsOrVisible),
  });


  // Private implementation

  private _normalizeOptions(
    optionsOrVisible: Partial<IFlexiModalButtonDirectiveOptions> | boolean | string
  ): IFlexiModalButtonDirectiveOptions {

    const options: Partial<IFlexiModalButtonDirectiveOptions> = (
      typeof optionsOrVisible === 'boolean'
        ? { visible: optionsOrVisible }
        : isPlainObject(optionsOrVisible)
          ? optionsOrVisible
          : {}
    );

    return <IFlexiModalButtonDirectiveOptions>{
      ...FLEXI_MODAL_OPTIONS_DEFAULT,
      ...options,
    };
  }
}
