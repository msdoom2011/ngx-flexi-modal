import { StylingHelper } from '../../support/helpers/styling-helper';

const propName = 'headerFontSize';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    // StylingHelper.checkDefaultValue(config, propName, checkHeaderFontSize);
    StylingHelper.checkStylingValue(config, propName, '14px', checkHeaderFontSize);
    StylingHelper.checkThemeValues(config, propName, { theme1: '12px', theme2: '16px' }, checkHeaderFontSize);
  }
});

function checkHeaderFontSize(value: boolean): void {
  cy.getCy('modal-header-wrapper')
    .invoke('css', 'font-size')
      .should('eq', value);
}
