import { StylingHelper } from '../../support/helpers/styling-helper';
import {
  fmDefaultStyling
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

const propName = 'frameShadow';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    // StylingHelper.checkDefaultValue(config, propName, checkFrameShadow);
    StylingHelper.checkStylingValue(config, propName, true, checkFrameShadow);
    // StylingHelper.checkStylingValue(config, propName, false, checkFrameShadow);
    // StylingHelper.checkStylingValue(config, propName, '10px 10px 20px 0 rgba(255, 0, 0, 0.5)', checkFrameShadow);
    // StylingHelper.checkThemeValues(config, propName, {
    //   theme1: true,
    //   theme2: false,
    //   theme3: '10px 10px 20px 0 rgba(255, 0, 0, 0.5)'
    // }, checkFrameShadow);
  }
});

function checkFrameShadow(value: string | boolean): void {
  if (typeof value === 'boolean') {
    const color = (String(fmDefaultStyling.frameShadow).match(/rgb.+$/) || [])[0];

    cy.getCy('modal-body')
      .invoke('css', 'box-shadow')
        .should(`${ value ? '' : 'not.' }include`, color)

  } else if (typeof value === 'string') {
    const color = (value.match(/rgb.+$/) || [])[0];

    cy.getCy('modal-body')
      .invoke('css', 'box-shadow')
        .should('include', color);
  }
}
