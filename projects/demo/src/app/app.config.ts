import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideFlexiModals} from "ngx-flexi-modal";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideFlexiModals(),
  ]
};
