import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MountResponse } from 'cypress/angular';
import { Provider, Type } from '@angular/core';
import Chainable = Cypress.Chainable;

import { provideFlexiModals } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { FlexiModalsService } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.service';
import {
  FmModalsOutletComponent
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import { FmModalWithComponent } from '../../../projects/ngx-flexi-modal/src/lib/models/fm-modal-with-component';
import {
  IFmModalWithComponentOptions
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.definitions';
import { Observable } from 'rxjs';

export function initializeServiceModals(
  ...providers: Array<Provider | Array<Provider>>
): Chainable<MountResponse<FmModalsOutletComponent>> {

  return cy.mount<FmModalsOutletComponent>('<fm-modals-outlet />', {
    imports: [
      FmModalsOutletComponent,
    ],
    providers: [
      provideNoopAnimations(),
      provideFlexiModals(...providers),
    ],
  });
}

export function showComponent<T extends object>(
  component: Type<T>,
  options?: Observable<any> | IFmModalWithComponentOptions<T>
): void {

  cy.inject(FlexiModalsService)
    .then(service => {
      cy.wrap(service.showComponent(component, <any>options)).as('modal');
    });
}
