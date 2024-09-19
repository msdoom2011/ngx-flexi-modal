import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideFlexiModals, withDefaultOptions} from "ngx-flexi-modal";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideFlexiModals(
      withDefaultOptions({
        closable: true,
      }),
      // withColorScheme({
      //   border: 'black',
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
      // withThemes([
      //   {
      //     name: 'dark',
      //     default: true,
      //     colors: {
      //       border: 'black',
      //       backdrop: 'rgba(4, 67, 81, 0.5)',
      //       headerText: '#333',
      //       headerBg: 'red',
      //       bodyText: '#333',
      //       bodyBg: 'green',
      //       footerText: '#333',
      //       footerBg: '#d9d9d9',
      //       actionBorder: 'transparent',
      //       actionText: '#6da6ad',
      //       actionBg: '#fff',
      //       actionPrimaryText: '#fff',
      //       actionPrimaryBg: '#6da6ad',
      //       actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
      //     }
      //   },
      //   {
      //     name: 'light',
      //     colors: {
      //       border: 'black',
      //       backdrop: 'rgba(4, 67, 81, 0.5)',
      //       headerText: '#333',
      //       headerBg: 'red',
      //       bodyText: '#333',
      //       bodyBg: '#fff',
      //       footerText: '#333',
      //       footerBg: '#d9d9d9',
      //       actionBorder: 'transparent',
      //       actionText: '#6da6ad',
      //       actionBg: '#fff',
      //       actionPrimaryText: '#fff',
      //       actionPrimaryBg: '#6da6ad',
      //       actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
      //     }
      //   },
      // ])
    ),
  ],
};
