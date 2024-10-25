import {animate, style, transition, trigger} from '@angular/animations';

export const getBackdropAnimation = (animationName: string) => {
  const duration = 300;

  return trigger(animationName, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${duration}ms {{ delay }}ms ease-in-out`, style({ opacity: 1 })),
    ], {
      params: {
        delay: 0,
      }
    }),
    transition(':leave', [
      animate(`${duration}ms ease-in-out`, style({ opacity: 0 })),
    ])
  ]);
};

export const getInstanceAnimation = (animationName: string) => {
  const duration = 300;

  return trigger(animationName, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${duration}ms ease-in-out`, style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate(`${duration}ms ease-in-out`, style({ opacity: 0 })),
    ])
  ]);
};
