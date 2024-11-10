import { StylingHelper } from '../../support/helpers/styling-helper';
import {
  fmDefaultStyling
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

const propName = 'verticalMargin';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkVerticalMargin);
    StylingHelper.checkStylingValue(config, propName, 20, checkVerticalMargin);
    StylingHelper.checkThemeValues(config, propName, { theme1: 60, theme2: 40 }, checkVerticalMargin);
  }
});

function checkVerticalMargin(value: number = fmDefaultStyling.verticalMargin): void {
  cy.getCy('modal-body-wrapper')
    .invoke('css', 'paddingTop')
    .should('eq', value + 'px');
  cy.getCy('modal-body-wrapper')
    .invoke('css', 'paddingBottom')
    .should('eq', value + 'px');
}
