export function generateRandomId(): number {
  return Math.round(new Date().valueOf() * Math.random() / 10000);
}

export function isPlainObject(obj: unknown): boolean {
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
