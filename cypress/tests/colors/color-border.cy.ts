import { colorToRgb } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'border'

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkBorder);
    ColorsHelper.checkColorSchemeValue(config, propName, checkBorder);
    ColorsHelper.checkThemeValues(config, propName, checkBorder);
  }
});

function checkBorder(color: string): void {
  cy.getCy('modal-body')
    .invoke('css', 'box-shadow')
      .should('include', colorToRgb(color));

  cy.getCy('modal-header-wrapper')
    .invoke('css', 'border-bottom-color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-header-actions')
    .invoke('css', 'border-left-color')
      .should('eq', colorToRgb(color));

  cy.getCy('modal-footer')
    .children()
    .first()
    .invoke('css', 'border-top-color')
      .should('eq', colorToRgb(color));
}
