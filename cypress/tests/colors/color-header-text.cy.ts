import { colorToRgb } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'headerText';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkHeaderText);
    ColorsHelper.checkColorSchemeValue(config, propName, checkHeaderText);
    ColorsHelper.checkThemeValues(config, propName, checkHeaderText);
  }
});

function checkHeaderText(color: string): void {
  cy.getCy('modal-header-wrapper')
    .invoke('css', 'color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-title')
    .invoke('css', 'color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-close-btn')
    .find('.line')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-maximize-btn')
    .find('.frame')
    .invoke('css', 'border-top-color')
      .should('eq', colorToRgb(color));
}
