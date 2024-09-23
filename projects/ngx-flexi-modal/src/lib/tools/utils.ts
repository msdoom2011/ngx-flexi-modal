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
