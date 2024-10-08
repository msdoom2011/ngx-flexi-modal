import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'actionPrimaryText';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionPrimaryText);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionPrimaryText);
    ColorsHelper.checkThemeValues(config, propName, checkActionPrimaryText);
  }
});

function checkActionPrimaryText(color: string): void {
  cy.get(cySelector('modal-action-button') + '.primary')
    .invoke('css', 'color')
      .should('eq', colorToRgb(color));
}
