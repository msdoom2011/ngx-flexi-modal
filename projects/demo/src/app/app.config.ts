import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideFlexiModals} from "ngx-flexi-modal";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideFlexiModals(),
  ]
};
