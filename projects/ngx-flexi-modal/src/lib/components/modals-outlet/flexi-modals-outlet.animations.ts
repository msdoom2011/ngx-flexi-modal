import {animate, style, transition, trigger} from "@angular/animations";

export const getBackdropAnimation = (animationName: string) => {
  return trigger(animationName, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`300ms {{ delay }}ms ease-in-out`, style({ opacity: 1 })),
    ], {
      params: {
        delay: 0,
      }
    }),
    transition(':leave', [
      animate(`300ms ease-in-out`, style({ opacity: 0 })),
    ])
  ]);
};

export const getInstanceAnimation = (animationName: string) => {
  return trigger(animationName, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`300ms ease-in-out`, style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate(`300ms ease-in-out`, style({ opacity: 0 })),
    ])
  ]);
};
