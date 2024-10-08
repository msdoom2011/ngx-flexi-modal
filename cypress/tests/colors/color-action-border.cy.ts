import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'actionBorder';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionBorder);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionBorder);
    ColorsHelper.checkThemeValues(config, propName, checkActionBorder);
  }
});

function checkActionBorder(color: string): void {
  cy.get(cySelector('modal-action-button') + ':not(.primary)')
    .invoke('css', 'border-color')
      .should('eq', colorToRgb(color));
}
