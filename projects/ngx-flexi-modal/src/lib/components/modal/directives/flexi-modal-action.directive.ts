import {Directive, inject, input, TemplateRef} from "@angular/core";

import {generateRandomId, isPlainObject} from "../../../tools/utils";
import {TFlexiModalButtonPosition} from "../../../services/modals/flexi-modals.definitions";

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
  public readonly templateRef = inject(TemplateRef);

  // Inputs
  public readonly options = input<
    IFlexiModalButtonDirectiveOptions,
    Partial<IFlexiModalButtonDirectiveOptions> | boolean | string
  >(FLEXI_MODAL_OPTIONS_DEFAULT, {
    alias: 'fmModalAction',
    transform: (optionsOrVisible) => this._normalizeOptions(optionsOrVisible),
  });

  // Public props
  public readonly id = 'fm-modal-action-' + generateRandomId();


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
