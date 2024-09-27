import {animate, query, sequence, style} from "@angular/animations";

import {FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR} from "./flexi-modal-instance-layout.component";
import {
  IFlexiModalAnimationConfig,
  TFlexiModalOpeningAnimation
} from "../../../../services/modals/flexi-modals.definitions";

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
    validate: () => true,
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
