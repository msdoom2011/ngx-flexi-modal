import { StylingHelper } from '../../support/helpers/styling-helper';

const propName = 'frameBorder';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkFrameBorder);
    StylingHelper.checkStylingValue(config, propName, true, checkFrameBorder);
    StylingHelper.checkThemeValues(config, propName, { theme1: true, theme2: false }, checkFrameBorder);
  }
});

function checkFrameBorder(isVisible: boolean): void {
  cy.getCy('modal-body')
    .invoke('css', 'box-shadow')
      .should(`${isVisible ? '' : 'not.'}include`, '0px 0px 0px 1px');
}
