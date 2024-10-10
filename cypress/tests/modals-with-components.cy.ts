import { SimpleTextComponent } from '../components/modal-content/simple-text/simple-text.component';
import { initializeServiceModals, showComponent } from '../support/helpers/common-helpers';
import {
  fmDefaultColorScheme,
  fmDefaultStyling,
} from '../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

describe('FmModalsOutletComponent', () => {
  const windowWidth = 500;
  const windowHeight = 500;

  beforeEach(() => {
    cy.viewport(windowWidth, windowHeight);
  });

  it('should display modal properly using default settings', () => {
    const contentHeight = 100;
    const minBodyWidth = 300;

    initializeServiceModals();
    showComponent(SimpleTextComponent);

    cy.getCy('modals-backdrop').should('be.visible').invoke('outerWidth').should('eq', windowWidth);
    cy.getCy('modals-backdrop').invoke('outerHeight').should('eq', windowHeight);

    // check layout
    cy.getCy('modal-backdrop').should('not.exist');
    cy.getCy('modal-closing-layer').invoke('outerWidth').should('eq', windowWidth);
    cy.getCy('modal-closing-layer').invoke('outerHeight').should('eq', windowHeight);
    cy.getCy('modal-body-wrapper').should('be.visible').should('contain.text', SimpleTextComponent.content);
    cy.getCy('modal-body-wrapper').invoke('css', 'paddingTop').should('eq', '50px');
    cy.getCy('modal-body-wrapper').invoke('css', 'paddingBottom').should('eq', '50px');
    cy.getCy('modal-body-wrapper').invoke('css', 'paddingLeft').should('eq', '30px');
    cy.getCy('modal-body-wrapper').invoke('css', 'paddingRight').should('eq', '30px');
    cy.getCy('modal-body').invoke('outerWidth').should('eq', minBodyWidth);
    cy.getCy('modal-body')
      .invoke('outerHeight')
        .should('be.lt', contentHeight + 10 + fmDefaultStyling.headerHeight)
        .should('be.gt', contentHeight - 1 + fmDefaultStyling.headerHeight);
    cy.getCy('modal-content')
      .should('have.class', 'scrollable')
      .invoke('outerHeight')
        .should('eq', contentHeight);

    // check header
    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-header-actions')
      .should('have.class', 'position-inside')
      .should('have.class', 'outside-corner')
      .invoke('children')
        .should('have.length', 1);
    cy.getCy('modal-title').should('not.exist');
    cy.getCy('modal-maximize-btn').should('not.exist');
    cy.getCy('modal-close-btn').should('be.visible').should('have.focus');

    // check footer
    cy.getCy('modal-footer').should('not.exist');

    // check loader
    cy.getCy('modal-loader').should('not.exist');
    cy.get('@modal').then((modal: any) => modal.startLoading());
    cy.getCy('modal-loader').should('be.visible').invoke('outerHeight').should('eq', contentHeight);
    cy.getCy('modal-loader').invoke('outerWidth').should('eq', minBodyWidth);
  });

  it.only('should display with correct styling', () => {
    const options = fmDefaultStyling;
    const frameShadowColor = (String(options.frameShadow).match(/rgba\([^)]+\)/) || [])[0];
    const title = 'Modal Title';
    const buttonLabel = 'Close';
    const contentHeight = 100;

    initializeServiceModals();
    showComponent(SimpleTextComponent, {
      title: title,
      actions: [ { label: buttonLabel } ],
    })
      .then(modal => cy.wrap(modal).as('modal'));

    cy.get('body')
      .invoke('css', 'font-size')
        .then((fontSize: any) => {
          cy.wrap(parseFloat(fontSize)).as('bodyFontSize');
        });
    cy.getCy('modal-body')
      .invoke('css', 'box-shadow')
        .should('include', frameShadowColor)
        .should('not.include', fmDefaultColorScheme.border);
    cy.getCy('modal-body').invoke('outerWidth').should('eq', 300);
    cy.getCy('modal-body').invoke('css', 'border-radius').should('eq', options.frameRounding + 'px');
    cy.getCy('modal-header-actions').should('have.class', 'position-' + options.headerActions);

    cy.getCy('modal-title')
      .invoke('css', 'font-size')
        .then((fontSize: any) => {
          cy.get('@bodyFontSize').should('be.lt', parseFloat(fontSize));
        });
    cy.getCy('modal-title')
      .invoke('css', 'font-weight')
        .should('eq', options.headerFontWeight);

    cy.getCy('modal-footer-actions')
      .find('[data-cy="modal-action-button"]')
        .should('have.length', 1);

    cy.getCy('modal-action-button')
      .should('have.class', 'right')
      .should('not.have.class', 'primary')
      .should('contain.text', buttonLabel);

    cy.getCy('modal-loader').should('not.exist');
    cy.get('@modal').then((modal: any) => modal.startLoading());
    cy.getCy('modal-loader')
      .should('be.visible')
      .invoke('outerHeight')
        .then((height) => {
          cy.getCy('modal-footer')
            .invoke('outerHeight')
              .as('footerHeight')
              .then((footerHeight: any) => {
                expect(height).to.equal(footerHeight + contentHeight);
              });
        });

    cy.getCy('modal-body').invoke('outerHeight').then((bodyHeight) => {
      cy.get('@footerHeight').then((footerHeight: any) => {
        expect(bodyHeight).to.equal(contentHeight + footerHeight + options.headerHeight);
      });
    });
  });
});
