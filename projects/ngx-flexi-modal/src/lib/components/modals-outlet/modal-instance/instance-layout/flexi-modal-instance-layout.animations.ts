import {animate, group, query, sequence, style, transition, trigger} from "@angular/animations";

import {FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR} from "./flexi-modal-instance-layout.component";
import {
  IFlexiModalAnimationConfig,
  TFlexiModalOpeningAnimation
} from "../../../../services/modals/flexi-modals.definitions";

export const getMaximizeAnimation = (animationName: string) => {
  return trigger(animationName, [
    transition('minimized => maximized', [
      group([
        query('.fm-modal--body-wrapper', [
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
          animate('600ms ease-in-out', style({
            width: '*',
            height: '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingLeft: '*',
            paddingRight: '*',
          })),
        ]),
        query('.fm-modal--body', [
          style({
            minHeight: '{{ height }}',
            height: '100%'
          }),
        ])
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
      group([
        query('.fm-modal--container', [
          style({
            height: '100vh',
            overflow: 'hidden',
            alignItems: '{{ alignItems }}',
          })
        ]),
        query('.fm-modal--body-wrapper', [
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
          animate('600ms ease-in-out', style({
            width: '*',
            height: '*',
            paddingTop: '*',
            paddingBottom: '*',
            paddingLeft: '*',
            paddingRight: '*',
          })),
        ]),
        query('.fm-modal--body', [
          style({
            width: '100%',
            minHeight: '100%',
          }),
        ]),
      ]),
    ], {
      params: {
        alignItems: 'flex-start',
      }
    }),
  ]);
};

export const flexiModalOpeningAnimations: Record<TFlexiModalOpeningAnimation, IFlexiModalAnimationConfig | null> = {
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
      query(FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR, [
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
        query(FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR, [
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
      query(FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR, [
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
        query(FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR, [
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
      query(FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR, [
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
        query(FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR, [
          style({ opacity: 0 }),
          animate('200ms ease-in-out', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  },
};
