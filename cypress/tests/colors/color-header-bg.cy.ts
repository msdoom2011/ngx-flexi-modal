import { colorToRgb } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'headerBg';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkHeaderBg);
    ColorsHelper.checkColorSchemeValue(config, propName, checkHeaderBg);
    ColorsHelper.checkThemeValues(config, propName, checkHeaderBg);
  }
});

function checkHeaderBg(color: string): void {
  cy.getCy('modal-header-wrapper')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-close-btn')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-maximize-btn')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));
}
