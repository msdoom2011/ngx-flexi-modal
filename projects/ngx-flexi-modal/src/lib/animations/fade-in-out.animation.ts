import {animate, style, transition, trigger} from "@angular/animations";

export function fadeInOutAnimation(name: string, duration: number = 300) {
  return trigger(name, [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(`${duration}ms ease-in-out`, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate(`${duration}ms ease-in-out`, style({ opacity: 0 }))
    ])
  ]);
}
