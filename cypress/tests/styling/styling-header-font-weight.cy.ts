import { StylingHelper } from '../../support/helpers/styling-helper';

const propName = 'headerFontWeight';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkFrameBorder);
    StylingHelper.checkStylingValue(config, propName, '400', checkFrameBorder);
    StylingHelper.checkThemeValues(config, propName, { theme1: '300', theme2: '600' }, checkFrameBorder);
  }
});

function checkFrameBorder(value: string): void {
  cy.getCy('modal-title')
    .invoke('css', 'font-weight')
      .should('eq', value);
}
