import {animate, animateChild, group, query, sequence, style, transition, trigger} from "@angular/animations";

import {IFmModalAnimationConfig} from "./fm-modal-instance-layout.definitions";
import {
  TFmModalOpeningAnimation
} from "../../../../services/modals/flexi-modals.definitions";
import {
  FM_MODAL_BODY_CLASS,
  FM_MODAL_BODY_WRAPPER_CLASS,
  FM_MODAL_CONTAINER_CLASS,
  FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR
} from "./fm-modal-instance-layout.constants";

export const getMaximizeAnimations = (animationName: string, actionsAnimationName: string) => {
  const duration = 500;

  return [
    trigger(animationName, [
      transition('minimized => maximized', [
        group([
          query(`.${FM_MODAL_BODY_WRAPPER_CLASS}`, [
            style({
              height: '{{ height }}',
              width: '{{ width }}',
              paddingTop: '{{ paddingTop }}',
              paddingBottom: '{{ paddingBottom }}',
              paddingLeft: '{{ paddingLeft }}',
              paddingRight: '{{ paddingRight }}',
              minWidth: '0',
              maxWidth: '100%',
              minHeight: 0,
              maxHeight: '100%',
              margin: '0 auto',
              overflow: 'hidden',
            }),
            animate(`${duration}ms ease-in-out`, style({
              width: '*',
              height: '*',
              paddingTop: '*',
              paddingBottom: '*',
              paddingLeft: '*',
              paddingRight: '*',
            })),
          ]),
          query(`.${FM_MODAL_BODY_CLASS}`, [
            style({
              minHeight: '{{ height }}',
              borderRadius: '{{ borderRadius }}',
              height: '100%'
            }),
            animate(`${duration}ms ease-in-out`, style({
              borderRadius: '*',
            }))
          ]),
          query(`@${actionsAnimationName}`, [
            animateChild()
          ], {
            optional: true,
          })
        ]),
      ], {
        params: {
          width: '0',
          height: '0',
          paddingTop: '0',
          paddingBottom: '0',
          paddingLeft: '0',
          paddingRight: '0',
        }
      }),
      transition('maximized => minimized', [
        sequence([
          group([
            query(`.${FM_MODAL_CONTAINER_CLASS}`, [
              style({
                height: '100vh',
                overflow: 'hidden',
                alignItems: '{{ alignItems }}',
              })
            ]),
            query(`.${FM_MODAL_BODY_WRAPPER_CLASS}`, [
              style({
                width: '100%',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                maxWidth: '100%',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                overflow: 'hidden',
                margin: '0 auto',
              }),
              animate(`${duration}ms ease-in-out`, style({
                width: '*',
                height: '*',
                paddingTop: '*',
                paddingBottom: '*',
                paddingLeft: '*',
                paddingRight: '*',
                borderRadius: '*',
              })),
            ]),
            query(`.${FM_MODAL_BODY_CLASS}`, [
              style({
                width: '100%',
                minHeight: '100%',
                borderRadius: 0,
              }),
              animate(`${duration}ms ease-in-out`, style({
                borderRadius: '*',
              }))
            ]),
          ]),
          query(`@${actionsAnimationName}`, [
            animateChild({ duration: 300 })
          ], {
            optional: true,
          }),
        ]),
      ], {
        params: {
          alignItems: 'flex-start',
        }
      }),
    ]),

    trigger(actionsAnimationName, [
      transition('* => *', [
        style({ opacity: 0, display: 'flex' }),
        animate(`${duration}ms ease-in-out`, style({ opacity: 1 })),
      ]),
    ])
  ];
};

export const getLoaderAnimations = (animationName: string) => {
  return [
    trigger(animationName, [
      transition('* => true', [
        style({ opacity: 0 }),
        animate(`{{ duration }}ms ease-in-out`, style({ opacity: 1 })),
      ], {
        params: {
          duration: 400,
        },
      }),
      transition('* => false', [
        style({ opacity: 1 }),
        animate(`{{ duration }}ms ease-in-out`, style({ opacity: 0 })),
      ], {
        params: {
          duration: 400,
        },
      })
    ])
  ];
};

export const getHeaderActionAnimations = (animationName: string) => {
  return [
    trigger(animationName, [
      transition(':enter', [
        style({ opacity: 0, width: 0, minWidth: 0 }),
        sequence([
          animate('300ms ease-in-out', style({ width: '*' })),
          animate('300ms ease-in-out', style({ opacity: '*' })),
        ]),
      ]),
    ]),
  ];
};

export const fmModalOpeningAnimations: Record<TFmModalOpeningAnimation, IFmModalAnimationConfig | null> = {
  'fade-in': null,

  'slide': {
    fallback: 'fade-in',
    validate: () => true,
    transition: () => ([
      style({ marginTop: -30 }),
      animate('250ms ease-out', style({ marginTop: 0 })),
    ]),
  },

  'zoom-in': {
    fallback: 'slide',
    validate: () => true,
    transition: () => ([
      style({
        transform: 'perspective(30cm) translate3d(0, 0, -300px)'
      }),
      animate('200ms ease-in-out', style({
        transform: 'perspective(30cm) translate3d(0, 0, 0)'
      })),
    ]),
  },

  'zoom-out': {
    fallback: 'slide',
    validate: (modalBodyElement: HTMLDivElement) => {
      return modalBodyElement.getBoundingClientRect().height < 800;
    },
    transition: () => ([
      style({
        transform: 'perspective(30cm) translate3d(0, 0, 300px)'
      }),
      animate('200ms ease-in-out', style({
        transform: 'perspective(30cm) translate3d(0, 0, 0)'
      })),
    ]),
  },

  'appear': {
    fallback: 'slide',
    validate: () => true,
    transition: () => ([
      query(FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR, [
        style({ opacity: 0 }),
      ], { optional: true }),
      sequence([
        query(':self', [
          style({
            transform: 'perspective(30cm) translate3d(0, 0, -500px) rotate3d(1, 0, 0, 45deg)',
            transformOrigin: 'top center 400px',
          }),
          animate('250ms ease-out', style({
            transform: 'perspective(30cm) translate3d(0, 0, 0) rotate3d(1, 0, 0, 0)',
            transformOrigin: 'top center 0',
          })),
        ]),
        query(FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR, [
          style({ opacity: 0 }),
          animate('200ms ease-in-out', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  },

  'fall-down': {
    fallback: 'slide',
    validate: () => true,
    transition: () => ([
      query(FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR, [
        style({ opacity: 0 }),
      ], { optional: true }),
      sequence([
        query(':self', [
          style({
            transform: 'perspective(30cm) translate3d(0, 0, 500px) rotate3d(1, 0, 0, 80deg)',
            transformOrigin: 'top center -200px',
          }),
          animate('300ms ease-out', style({
            transform: 'perspective(30cm) rotate3d(1, 0, 0, 0)',
            transformOrigin: 'top center 0',
          })),
        ]),
        query(FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR, [
          style({ opacity: 0 }),
          animate('200ms ease-in-out', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  },

  'roll-out': {
    fallback: 'slide',
    validate: (modalBodyElement: HTMLDivElement) => {
      return modalBodyElement.getBoundingClientRect().height < 600;
    },
    transition: () => ([
      query(FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR, [
        style({ opacity: 0 }),
      ], { optional: true }),
      sequence([
        query(':self', [
          style({
            transform: 'perspective(30cm) translate3d(0, 0, -100px) rotate3d(1, 0, 0, 85deg)',
            transformOrigin: 'center center -100px',
          }),
          animate('300ms ease-out', style({
            transform: 'perspective(30cm) translate3d(0, 0, -100px) rotate3d(1, 0, 0, 0)',
            transformOrigin: 'center center -100px',
          })),
        ]),
        query(FM_MODAL_HEADER_ACTIONS_OUTSIDE_SELECTOR, [
          style({ opacity: 0 }),
          animate('200ms ease-in-out', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  },
};