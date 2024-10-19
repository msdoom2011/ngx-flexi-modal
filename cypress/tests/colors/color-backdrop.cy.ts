import { Provider } from '@angular/core';

import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { ColorsHelper, IColorTestsConfig } from '../../support/helpers/colors-helper';
import { colorToRgb, showComponent } from '../../support/helpers/common-helpers';

const propName = 'backdrop';

describe(`Testing color "${propName}"`, () => {
  const configs: Array<IColorTestsConfig> = [
    {
      label: (label: string) => label,
      initialize: initializeBackdrop,
      templated: false,
    },
    {
      label: (label: string) => `${label} for template defined modal`,
      initialize: initializeBackdropTemplated,
      templated: true,
    },
  ];

  for (const config of configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkBackdrop);
    ColorsHelper.checkColorSchemeValue(config, propName, checkBackdrop);
    ColorsHelper.checkThemeValues(config, propName, checkBackdrop);
  }
});

function initializeBackdrop(...providers: Array<Provider | Array<Provider>>): void {
  ColorsHelper.initializeModal(...providers);
  openSecondModal();
}

function initializeBackdropTemplated(...providers: Array<Provider | Array<Provider>>): void {
  ColorsHelper.initializeModalTemplated(...providers);
  openSecondModal();
}

function openSecondModal(): void {
  showComponent(SimpleTextComponent, { id: 'second-modal' });

  cy.get('#second-modal').should('be.visible');
}

function checkBackdrop(color: string): void {
  cy.getCy('modals-backdrop')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-backdrop')
    .should('have.length', 1)
    .should('be.visible')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));
}
