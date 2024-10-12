import { StylingHelper } from '../../support/helpers/styling-helper';
import {
  IFmModalStylingOptions
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.definitions';
import { colorToRgb } from '../../support/helpers/common-helpers';
import {
  fmDefaultColorScheme
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

const propName = 'headerActionsWithBg';

describe(`Testing '${propName}' styling`, () => {
  const defaultStyling: IFmModalStylingOptions = { headerActionsPosition: 'outside' };

  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkHeaderActionsWithBg, defaultStyling);
    StylingHelper.checkStylingValue(config, propName, false, checkHeaderActionsWithBg, defaultStyling);
    StylingHelper.checkThemeValues(config, propName, { theme1: true, theme2: false }, checkHeaderActionsWithBg, defaultStyling);
  }
});

function checkHeaderActionsWithBg(withBg: boolean): void {
  cy.getCy('modal-header-actions')
    .children()
    .invoke('css', 'background-color')
      .should('eq', withBg ? colorToRgb(fmDefaultColorScheme.bodyBg) : 'rgba(0, 0, 0, 0)');
}
