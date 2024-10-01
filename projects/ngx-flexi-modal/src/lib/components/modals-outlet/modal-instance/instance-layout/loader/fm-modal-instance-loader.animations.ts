import { animate, style, transition, trigger } from '@angular/animations';

export const getLoaderAnimation = (animationName: string) => {
  return trigger(animationName, [
    transition('* => true', [
      style({ opacity: 0 }),
      animate('{{ duration }}ms ease-in-out', style({ opacity: 1 })),
    ], {
      params: {
        duration: 400,
      },
    }),
    transition('* => false', [
      style({ opacity: 1 }),
      animate('{{ duration }}ms ease-in-out', style({ opacity: 0 })),
    ], {
      params: {
        duration: 400,
      },
    })
  ]);
};
