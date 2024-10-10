import { StylingHelper } from '../../support/helpers/styling-helper';

const propName = 'headerFontSize';

describe(`Testing '${propName}' styling`, () => {
  for (const config of StylingHelper.makeConfigs()) {
    const { initialize, label } = config;

    StylingHelper.checkStylingValue(config, propName, '14px', checkHeaderFontSize);
    StylingHelper.checkThemeValues(config, propName, { theme1: '12px', theme2: '16px' }, checkHeaderFontSize);

    it (label('check default value'), () => {
      initialize();

      cy.getCy('modal-body')
        .invoke('css', 'font-size')
        .then((fontSize: any) => {
          cy.wrap(parseFloat(fontSize)).as('bodyFontSize')
        });

      cy.getCy('modal-title')
        .invoke('css', 'font-size')
        .then((titleFontSize: any) => {
          cy.get('@bodyFontSize').then((bodyFontSize: any) => {
            expect(parseFloat(titleFontSize)).to.gt(bodyFontSize);
          })
        });
    });
  }
});

function checkHeaderFontSize(value: boolean): void {
  cy.getCy('modal-title')
    .invoke('css', 'font-size')
      .should('eq', value);
}
