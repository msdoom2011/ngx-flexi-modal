import { Provider } from '@angular/core';

import { colorToRgb, cySelector } from '../../support/helpers/helpers';
import { ColorsHelper, IColorTestsConfig } from '../../support/helpers/colors-helper';

const propName = 'spinner';

describe(`Testing color "${propName}"`, () => {
  const configs: Array<IColorTestsConfig> = [
    {
      label: (label: string) => label,
      initialize: initializeLoader,
      templated: false,
    },
    {
      label: (label: string) => `${label} for template defined modal`,
      initialize: initializeLoaderTemplated,
      templated: true,
    },
  ];

  for (const config of configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkLoaderColor);
    ColorsHelper.checkColorSchemeValue(config, propName, checkLoaderColor);
    ColorsHelper.checkThemeValues(config, propName, checkLoaderColor);
  }
});

function initializeLoader(...providers: Array<Provider | Array<Provider>>): void {
  ColorsHelper.initializeModal(...providers);

  cy.get('@modal').then((modal: any) => modal.startLoading());
  cy.getCy('modal-loader').should('be.visible');
}

function initializeLoaderTemplated(...providers: Array<Provider | Array<Provider>>): void {
  ColorsHelper.initializeModalTemplated(...providers);

  cy.get('@modal').then((modal: any) => modal.startLoading());
  cy.getCy('modal-loader').should('be.visible');
}

function checkLoaderColor(color: string): void {
  cy.getCy('modal-loader')
    .find(cySelector('round-dotted-spinner') + ' .dot')
      .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));
}
