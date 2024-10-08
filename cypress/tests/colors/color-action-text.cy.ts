import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper, IColorTestsConfig } from '../../support/helpers/colors-helper';

const propName = 'actionText';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionText);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionText);
    ColorsHelper.checkThemeValues(config, propName, checkActionText);
  }
});

function checkActionText(color: string): void {
  cy.get(cySelector('modal-action-button') + ':not(.primary)')
    .invoke('css', 'color')
      .should('eq', colorToRgb(color));
}
