import { colorToRgb } from '../../support/helpers/helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'footerText';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkFooterText);
    ColorsHelper.checkColorSchemeValue(config, propName, checkFooterText);
    ColorsHelper.checkThemeValues(config, propName, checkFooterText);
  }
});

function checkFooterText(color: string): void {
  cy.getCy('modal-footer-wrapper')
    .invoke('css', 'color')
    .should('eq', colorToRgb(color));
}
