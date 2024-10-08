import { colorToRgb, cySelector } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'actionFocusOutline';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.makeConfigs(false)) {
    ColorsHelper.checkDefaultValue(config, propName, checkActionFocusOutline);
    ColorsHelper.checkColorSchemeValue(config, propName, checkActionFocusOutline);
    ColorsHelper.checkThemeValues(config, propName, checkActionFocusOutline);
  }
});

function checkActionFocusOutline(color: string): void {
  cy.get(cySelector('modal-action-button') + ':not(.primary)')
    .focus()
    .invoke('css', 'box-shadow')
      .should('include', colorToRgb(color));

  cy.get(cySelector('modal-action-button') + '.primary')
    .focus()
    .invoke('css', 'box-shadow')
      .should('include', colorToRgb(color));
}
