import {Directive, inject, input, TemplateRef} from '@angular/core';

import {generateRandomId, isPlainObject} from '../../../tools/utils';
import {TFmModalButtonPosition} from '../../../services/modals/flexi-modals.definitions';

export interface IFmModalActionDirectiveOptions {
  visible?: boolean;
  closeOnClick?: boolean;
  position?: TFmModalButtonPosition;
}

const FM_MODAL_ACTION_OPTIONS_DEFAULT: IFmModalActionDirectiveOptions = {
  visible: true,
  closeOnClick: true,
  position: 'right',
};

@Directive({
  selector: '[fmModalAction]',
  exportAs: 'fmModalAction',
  standalone: true,
})
export class FmModalActionDirective {

  // Dependencies
  public readonly templateRef = inject(TemplateRef);

  // Inputs
  public readonly options = input<
    IFmModalActionDirectiveOptions,
    Partial<IFmModalActionDirectiveOptions> | boolean | string
  >(FM_MODAL_ACTION_OPTIONS_DEFAULT, {
    alias: 'fmModalAction',
    transform: (optionsOrVisible) => this._normalizeOptions(optionsOrVisible),
  });

  // Public props
  public readonly id = 'fm-modal-action-' + generateRandomId();


  // Private implementation

  private _normalizeOptions(
    optionsOrVisible: Partial<IFmModalActionDirectiveOptions> | boolean | string
  ): IFmModalActionDirectiveOptions {

    const options: Partial<IFmModalActionDirectiveOptions> = (
      typeof optionsOrVisible === 'boolean'
        ? { visible: optionsOrVisible }
        : isPlainObject(optionsOrVisible)
          ? optionsOrVisible
          : {}
    );

    return <IFmModalActionDirectiveOptions>{
      ...FM_MODAL_ACTION_OPTIONS_DEFAULT,
      ...options,
    };
  }
}
