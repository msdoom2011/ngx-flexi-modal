import { StylingHelper } from '../../support/helpers/styling-helper';
import {
  fmDefaultStyling
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

const propName = 'horizontalMargin';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkHorizontalMargin);
    StylingHelper.checkStylingValue(config, propName, 20, checkHorizontalMargin);
    StylingHelper.checkThemeValues(config, propName, { theme1: 60, theme2: 40 }, checkHorizontalMargin);
  }
});

function checkHorizontalMargin(value: number = fmDefaultStyling.horizontalMargin): void {
  cy.getCy('modal-body-wrapper')
    .invoke('css', 'paddingLeft')
    .should('eq', value + 'px');
  cy.getCy('modal-body-wrapper')
    .invoke('css', 'paddingRight')
    .should('eq', value + 'px');
}
