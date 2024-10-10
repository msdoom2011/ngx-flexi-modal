import { colorToRgb } from '../../support/helpers/common-helpers';
import { ColorsHelper } from '../../support/helpers/colors-helper';

const propName = 'footerBg';

describe(`Testing color "${propName}"`, () => {
  for (const config of ColorsHelper.configs) {
    ColorsHelper.checkDefaultValue(config, propName, checkFooterBg);
    ColorsHelper.checkColorSchemeValue(config, propName, checkFooterBg);
    ColorsHelper.checkThemeValues(config, propName, checkFooterBg);
  }
});

function checkFooterBg(color: string): void {
  cy.getCy('modal-footer')
    .children()
    .first()
    .invoke('css', 'background-color')
      .should('eq', colorToRgb(color));
}
