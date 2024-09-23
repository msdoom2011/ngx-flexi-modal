import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideFlexiModals, withDefaultOptions, withThemes} from "ngx-flexi-modal";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideFlexiModals(
      withDefaultOptions({
        // closable: true
      }),
      // withStyling({
        // frameShadow: '20px 20px 20px 0 rgba(255, 0, 0, 0.3)',
        // frameBorder: false,
        // frameRounding: 10,
        // closeBtn: {
        //   position: 'outside'
        // }
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
            backdrop: 'rgba(4, 67, 81, 0.5)',
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
            closeBtn: {
              label: undefined,
              position: 'outside'
            },
          }
        },
        {
          name: 'light',
          default: false,
          colors: {
            border: 'black',
          },
          styling: {
            frameBorder: true,
            frameShadow: false,
          }
        },
      ])
    ),
  ],
};
