import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFlexiModals, withDefaultOptions, withModalPresets, withThemes } from 'ngx-flexi-modal';

import { modalBasicCustomPresets } from './modal/basic-custom/modal-basic-custom.presets';


export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideFlexiModals(
      withModalPresets([
        modalBasicCustomPresets,
      ]),
      withDefaultOptions({
        position: 'top',
        closable: true,
        maximizable: true,
        scroll: 'content',
        animation: 'zoom-out',
        spinner: 'round-dotted',
      }),
      // withWidthPresets({
      //   large: 1280,
      //   big: 960,
      //   medium: 768,
      //   small: 568,
      //   tiny: 700,
      // }),
      // withStyling({
        // frameShadow: '20px 20px 20px 0 rgba(255, 0, 0, 0.3)',
        // frameBorder: false,
        // frameRounding: 10,
      // }),
      // withColorScheme({
        // border: '#ccc',
        // headerBg: 'transparent',
      //   // backdrop: 'rgba(4, 67, 81, 0.5)',
      //   // headerText: '#333',
      //   headerBg: 'red',
      //   // bodyText: '#333',
      //   // bodyBg: '#fff',
      //   // footerText: '#333',
      //   // footerBg: '#d9d9d9',
      //   // actionBorder: 'transparent',
      //   // actionText: '#6da6ad',
      //   // actionBg: '#fff',
      //   // actionPrimaryText: '#fff',
      //   // actionPrimaryBg: '#6da6ad',
      //   // actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
      // }),
      withThemes([
        {
          name: 'dark',
          default: true,
          colors: {
            border: 'black',
            backdrop: 'transparent',
            headerText: '#333',
            headerBg: 'red',
            bodyText: '#333',
            bodyBg: 'green',
            footerText: '#333',
            footerBg: 'blue',
            actionBorder: 'transparent',
            actionText: '#6da6ad',
            actionBg: '#fff',
            actionPrimaryText: '#fff',
            actionPrimaryBg: '#6da6ad',
            actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
          },
          styling: {
            // frameShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
            frameShadow: false,
            frameBorder: false,
            frameRounding: 20,
          }
        },
        {
          name: 'light',
          default: true,
          colors: {
            headerBg: '#f0f0f0',
            footerBg: '#f0f0f0',
            actionBg: '#f0f0f0',
          },
          styling: {
            headerHeight: 40,
            headerActionsPosition: 'outside',
            headerActionsWithBg: false,
          }
        },
      ])
    ),
  ],
};
