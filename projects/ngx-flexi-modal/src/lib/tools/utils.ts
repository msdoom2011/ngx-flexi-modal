import {IFmModalWithComponentOptions, IFmModalOptions} from '../services/modals/flexi-modals.definitions';
import {IFmModalBasicInputs} from '../presets/basic/fm-modal-basic.definitions';
import {FmModalWithComponent} from '../models/fm-modal-with-component';
import { IFmModalAware } from '../components/fm-modal.abstract';

export function generateRandomNumber(): number {
  return Math.round(new Date().valueOf() * Math.random() / 10000);
}

export function isPlainObject(obj: unknown): obj is object  {
  return (
    !!obj
    && typeof obj === 'object'
    && obj.constructor === Object
  );
}

export function findFocusableElements(element: Element): Array<Element & { focus: () => void }> {
  return <Array<Element & { focus: () => void }>>Array.from(
    element.querySelectorAll([
      'a[href]',
      'button',
      'input',
      'textarea',
      'select',
      'details',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]:not([contenteditable="false"])',
    ].join(', '))
  )
    .filter(el => {
      return (
        !el.hasAttribute('disabled')
        && !el.getAttribute('aria-hidden')
      );
    });
}

export function normalizeOptions(
  optionsObj: Record<string, unknown>,
  switchableProps: Array<string> = []
): Partial<Record<string, unknown>> {

  const options = { ...optionsObj };

  for (const optName in options) {
    if (
      Object.prototype.hasOwnProperty.call(options, optName)
      && (
        options[optName] === undefined
        || (
          switchableProps.includes(optName)
          && options[optName] === true
        ) || (
          isPlainObject(options[optName])
          && Object.keys(options[optName]).length === 0
        )
      )
    ) {
      delete options[optName];
    }
  }

  return options;
}

export function extendModalWithComponentOptions<
  ComponentT extends Partial<IFmModalAware>,
  InputsT extends Record<string, unknown>
>(
  basicOptions: IFmModalWithComponentOptions<ComponentT, Partial<InputsT>>,
  userOptions: IFmModalOptions<FmModalWithComponent<ComponentT, InputsT>> & Partial<InputsT>,
  inputNames: Array<keyof InputsT>,
): IFmModalWithComponentOptions<ComponentT, InputsT> {

  const userOptionsNormalized = normalizeOptions({...userOptions});
  const inputOptions = <Partial<IFmModalBasicInputs>>{ ...(basicOptions.inputs || {}) };

  for (const inputName of inputNames) {
    if (inputName in userOptions) {
      (<any>inputOptions)[inputName] = userOptions[<keyof InputsT>inputName];
    }
  }

  for (const inputName of [...inputNames, 'inputs']) {
    if (inputName in userOptionsNormalized) {
      delete userOptionsNormalized[<keyof IFmModalBasicInputs>inputName];
    }
  }

  return <IFmModalWithComponentOptions<ComponentT, InputsT>>{
    ...basicOptions,
    inputs: inputOptions,
    ...userOptionsNormalized,
  };
}
