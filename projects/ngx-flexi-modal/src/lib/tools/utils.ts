import {IFmModalWithComponentOptions, IFmModalOptions} from '../services/modals/flexi-modals.definitions';
import {IFmModalBasicInputs} from '../presets/basic/fm-modal-basic.definitions';
import {FmModalWithComponent} from '../models/fm-modal-with-component';

export function generateRandomNumber(): number {
  return Math.round(new Date().valueOf() * Math.random() / 10000);
}

export function isPlainObject(obj: unknown): obj is Record<string, unknown>  {
  return (
    !!obj
    && typeof obj === 'object'
    && obj.constructor === Object
  );
}

export function findFocusableElements(element: Element): Array<Element & { focus: () => void; blur: () => void }> {
  return <Array<Element & { focus: () => void; blur: () => void }>>Array.from(
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

export function appendHeaderStyleElement(classDefinitions: Array<string>): HTMLStyleElement {
  const element = document.createElement('style');

  element.innerHTML = classDefinitions.join('\n');
  document.getElementsByTagName('head')[0].appendChild(element);

  return element;
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

export function extendModalOptionsWithInputs<
  ComponentT extends object,
  InputsT extends object
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
