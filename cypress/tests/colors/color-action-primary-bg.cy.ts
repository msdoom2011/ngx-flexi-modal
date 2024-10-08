import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'actionPrimaryBg';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionPrimaryBg);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionPrimaryBg);
    ColorsHelper.checkThemeValues(config, propName, checkActionPrimaryBg);
  }
});

function checkActionPrimaryBg(color: string): void {
  cy.get(cySelector('modal-action-button') + '.primary')
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));
}
