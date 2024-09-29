import {IFlexiModalComponentOptions, IFlexiModalOptions} from "../services/modals/flexi-modals.definitions";
import {IFlexiModalBasicInputs} from "../extensions/basic/flexi-modal-basic.definitions";
import {FlexiModalWithComponent} from "../models/flexi-modal-with-component";

export function generateRandomId(): number {
  return Math.round(new Date().valueOf() * Math.random() / 10000);
}

export function isPlainObject(obj: unknown): obj is object  {
  return (
    !!obj
    && typeof obj === 'object'
    && obj.constructor === Object
  );
}

export function findFocusableElements(element: Element): Array<Element & { focus: () => any }> {
  return <Array<Element & { focus: () => any }>>Array.from(
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
  optionsObj: Record<string, any>,
  switchableProps: Array<string> = []
): Partial<Record<string, any>> {

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

export function extendComponentModalOptions<ComponentT, InputsT extends object>(
  basicOptions: IFlexiModalComponentOptions<ComponentT, Partial<InputsT>>,
  userOptions: IFlexiModalOptions<FlexiModalWithComponent<ComponentT, InputsT>> & Partial<InputsT>,
  inputNames: Array<keyof InputsT>,
): IFlexiModalComponentOptions<ComponentT, InputsT> {

  const userOptionsNormalized = normalizeOptions({...userOptions});
  const inputOptions = <Partial<IFlexiModalBasicInputs>>{ ...(basicOptions.inputs || {}) };

  for (const inputName of inputNames) {
    if (inputName in userOptions) {
      (<any>inputOptions)[inputName] = userOptions[<keyof InputsT>inputName];
    }
  }

  for (const inputName of [...inputNames, 'inputs']) {
    if (inputName in userOptionsNormalized) {
      delete userOptionsNormalized[<keyof IFlexiModalBasicInputs>inputName];
    }
  }

  return <IFlexiModalComponentOptions<ComponentT, InputsT>>{
    ...basicOptions,
    inputs: inputOptions,
    ...userOptionsNormalized,
  };
}
