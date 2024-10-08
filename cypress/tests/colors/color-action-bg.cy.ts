import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'actionBg';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionBg);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionBg);
    ColorsHelper.checkThemeValues(config, propName, checkActionBg);
  }
});

function checkActionBg(color: string): void {
  cy.get(cySelector('modal-action-button') + ':not(.primary)')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));
}
