import { StylingHelper } from '../../support/helpers/styling-helper';
import {
  fmDefaultStyling
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

const propName = 'frameRounding';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    StylingHelper.checkDefaultValue(config, propName, checkFrameRounding);
    StylingHelper.checkStylingValue(config, propName, true, checkFrameRounding);
    StylingHelper.checkStylingValue(config, propName, false, checkFrameRounding);
    StylingHelper.checkStylingValue(config, propName, 10, checkFrameRounding);
    StylingHelper.checkThemeValues(config, propName, { theme1: true, theme2: false, theme3: 10 }, checkFrameRounding);
  }
});

function checkFrameRounding(value: number | boolean): void {
  if (typeof value === 'boolean') {
    performCheck(value ? fmDefaultStyling.frameRounding + 'px' : '0px');

  } else if (typeof value === 'string') {
    performCheck(value + 'px');
  }

  function performCheck(cssPropertyValue: string): void {
    cy.getCy('modal-body')
      .invoke('css', 'border-radius')
        .should('eq', cssPropertyValue);

    cy.getCy('modal-header-wrapper')
      .invoke('css', 'border-radius')
        .should('eq', cssPropertyValue === '0px'
          ? cssPropertyValue
          : `${cssPropertyValue} ${cssPropertyValue} 0px 0px`);

    cy.getCy('modal-footer-wrapper')
      .invoke('css', 'border-radius')
        .should('eq', cssPropertyValue === '0px'
          ? cssPropertyValue
          : `0px 0px ${cssPropertyValue} ${cssPropertyValue}`);

    cy.getCy('modal-header-actions')
      .children()
      .first()
        .invoke('css', 'border-radius')
          .should('eq', cssPropertyValue === '0px'
            ? cssPropertyValue
            : `0px ${cssPropertyValue} 0px 0px`
          );
  }
}
