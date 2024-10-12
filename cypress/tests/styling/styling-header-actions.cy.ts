import { StylingHelper } from '../../support/helpers/styling-helper';
import {
  TFmModalHeaderActionsPosition
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.definitions';

const propName = 'headerActionsPosition';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkHeaderActions);
    StylingHelper.checkStylingValue(config, propName, 'outside', checkHeaderActions);
    StylingHelper.checkThemeValues(config, propName, { theme1: 'outside', theme2: 'inside' }, checkHeaderActions);
  }
});

function checkHeaderActions(position: TFmModalHeaderActionsPosition): void {
  cy.getCy('modal-header-actions').should('have.class', `position-${position}`);
  cy.getCy('modal-maximize-btn').should('have.class', `position-${position}`);
  cy.getCy('modal-close-btn').should('have.class', `position-${position}`);
}
