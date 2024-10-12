import { StylingHelper } from '../../support/helpers/styling-helper';

const propName = 'headerHeight';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkHeaderHeight);
    StylingHelper.checkStylingValue(config, propName, 20, checkHeaderHeight);
    StylingHelper.checkThemeValues(config, propName, { theme1: 50, theme2: 40 }, checkHeaderHeight);
  }
});

function checkHeaderHeight(value: number): void {
  cy.getCy('modal-header-wrapper')
    .invoke('outerHeight')
      .should('eq', value >= 30 ? value : 30);
}
