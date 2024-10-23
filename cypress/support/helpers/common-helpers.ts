import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MountResponse } from 'cypress/angular';
import { Provider, Type } from '@angular/core';
import { Observable } from 'rxjs';
import Chainable = Cypress.Chainable;

import { provideFlexiModals } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { FlexiModalsService } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.service';
import {
  FmModalsOutletComponent
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import {
  IFmModalWithComponentOptions
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.definitions';
import { ModalWithTemplateRootComponent } from '../../components/modals-templated/modal-with-template-root.component';
import { ModalWithTemplate } from '../../components/modals-templated/modal-with-template';
import { FmModalWithComponent } from '../../../projects/ngx-flexi-modal/src/lib/models/fm-modal-with-component';

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

export function initializeTemplateModals<C extends ModalWithTemplate>(
  modalComponent: Type<C>,
  componentProperties: Partial<{ inputs: object, outputs: object }> = {},
  ...providers: Array<Provider | Array<Provider>>
): Chainable<MountResponse<ModalWithTemplateRootComponent<C>>> {

  const mountResult = cy.mount<ModalWithTemplateRootComponent<C>>(ModalWithTemplateRootComponent, {
    componentProperties: {
      component: modalComponent,
      ...componentProperties,
    },
    imports: [
      modalComponent
    ],
    providers: [
      provideNoopAnimations(),
      provideFlexiModals(...providers),
    ],
  })
    .then(mountResponse=> {
      cy.wrap(mountResponse.fixture).as('fixture');
      cy.wrap(mountResponse.component).as('component');

      return cy.wrap(mountResponse);
    });

  cy.get('@component').its('modal').should('be.ok');
  cy.get('@component').then((component: any) => {
    cy.wrap(component.modal).as('modalComponent');
    cy.wrap(component.modal.modal()).as('modal');
  });

  return mountResult;
}

export function showComponent<T extends object>(
  component: Type<T>,
  options?: Observable<any> | IFmModalWithComponentOptions<T>
): Chainable<FmModalWithComponent | null> {

  return cy.inject(FlexiModalsService)
    .then(service => {
      return cy.wrap(service.show(component, <any>options));
    });
}

export function cySelector(cyIds: string): string {
  return cyIds.split(/\s+/)
    .map(part => `[data-cy="${part}"]`)
    .join(' ');
}

export function colorToRgb(hex: string): string {
  if (hex.indexOf('rgb') >= 0 || typeof hex !== 'string') {
    return hex;
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : hex;
}
