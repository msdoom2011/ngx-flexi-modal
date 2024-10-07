import { colorToRgb } from '../../support/helpers/helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'bodyText';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkBodyBg);
    ColorsHelper.checkColorSchemeValue(config, propName, checkBodyBg);
    ColorsHelper.checkThemeValues(config, propName, checkBodyBg);
  }
});

function checkBodyBg(color: string): void {
  cy.getCy('modal-body')
    .invoke('css', 'color')
    .should('eq', colorToRgb(color));
}
