import {animate, sequence, style, transition, trigger} from '@angular/animations';

export const getHeaderActionsAnimation = (animationName: string)=> {
  return trigger(animationName, [
    transition('* => *', [
      style({ opacity: 0, display: 'flex' }),
      animate('500ms ease-in-out', style({ opacity: 1 })),
    ]),
  ]);
}

export const getHeaderActionAnimation = (animationName: string) => {
  return trigger(animationName, [
    transition(':enter', [
      style({ opacity: 0, width: 0, minWidth: 0 }),
      sequence([
        animate('300ms ease-in-out', style({ width: '*' })),
        animate('300ms ease-in-out', style({ opacity: '*' })),
      ]),
    ]),
  ]);
};
