import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'actionPrimaryBorder';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionPrimaryBorder);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionPrimaryBorder);
    ColorsHelper.checkThemeValues(config, propName, checkActionPrimaryBorder);
  }
});

function checkActionPrimaryBorder(color: string): void {
  cy.get(cySelector('modal-action-button') + '.primary')
    .invoke('css', 'border-color')
      .should('eq', colorToRgb(color));
}
