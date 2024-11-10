import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { TFmModalScroll } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.definitions';
import { ModalManyTextComponent } from '../../components/modals-templated/modals/modal-many-text.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { ManyTextComponent } from '../../components/modal-content/many-text.component';
import {
  fmDefaultStyling
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';
import {
  fmModalOptionsDefault
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.constants';

const viewportHeight = 500;

describe('Option "scroll"', () => {
  beforeEach(() => {
    cy.viewport(500, viewportHeight);
  });

  it('should correspond to the default value (service)', () => {
    initializeServiceModals();

    showComponent(ManyTextComponent).then((modal: any) => {
      expect(modal.config().scroll).to.eq(fmModalOptionsDefault.scroll);
    });

    checkViewports(fmModalOptionsDefault.scroll);
  });

  it('should correspond to the default value (template)', () => {
    initializeTemplateModals(ModalManyTextComponent, { inputs: { opened: true }});

    cy.get('@modal').then((modal: any) => {
      expect(modal.config().scroll).to.eq(fmModalOptionsDefault.scroll);
    });

    checkViewports(fmModalOptionsDefault.scroll);
  });

  it('should correspond to redefined default value (service)', () => {
    initializeServiceModals(
      withDefaultOptions({ scroll: 'modal' }),
    );

    showComponent(ManyTextComponent).then((modal: any) => {
      expect(modal.config().scroll).to.eq('modal');
    });

    checkViewports('modal');
  });

  it('should correspond to redefined default value (template)', () => {
    initializeTemplateModals(
      ModalManyTextComponent,
      { inputs: { opened: true }},
      withDefaultOptions({ scroll: 'modal' })
    );

    cy.get('@modal').then((modal: any) => {
      expect(modal.config().scroll).to.eq('modal');
    });

    checkViewports('modal');
  });

  it('should be configurable (service)', () => {
    initializeServiceModals();

    showComponent(ManyTextComponent, {
      scroll: 'modal',
      actions: [
        { label: 'Close' },
      ],
    })
      .then((modal: any) => {
        cy.wrap(modal).as('modal');
      });

    checkViewports('modal');

    cy.get('@modal').then((modal: any) => {
      modal.update({ scroll: 'content' });
    });
    checkViewports('content');

    cy.get('@modal').then((modal: any) => {
      modal.maximize();
    });
    cy.getCy('modal').should('have.class', 'maximized');
    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-footer').should('be.visible');

    cy.getCy('modal-content').scrollTo('bottom');

    cy.get('#very-last-item').should('be.visible');
    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-footer').should('be.visible');

    cy.getCy('modal-content').scrollTo('top');

    cy.get('@modal').then((modal: any) => {
      modal.update({ scroll: 'modal' });
    });

    checkViewports('modal');

    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-footer').should('not.be.visible');

    cy.getCy('modal').scrollTo('bottom');
    cy.get('#very-last-item').should('be.visible');

    cy.getCy('modal-header-wrapper').should('not.be.visible');
    cy.getCy('modal-footer').should('be.visible');
  });

  it('should be configurable (template)', () => {
    initializeTemplateModals(
      ModalManyTextComponent,
      { inputs: { opened: true, scroll: 'modal' }},
    );

    checkViewports('modal');

    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-footer').should('not.be.visible');
    cy.getCy('modal').scrollTo('bottom');

    cy.getCy('modal-header-wrapper').should('not.be.visible');
    cy.getCy('modal-footer').should('be.visible');
    cy.getCy('modal').scrollTo('top');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { scroll: 'content' });
      fixture.detectChanges();
    });

    checkViewports('content');

    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-footer').should('be.visible');
    cy.getCy('modal-content').scrollTo('bottom');

    cy.getCy('modal-header-wrapper').should('be.visible');
    cy.getCy('modal-footer').should('be.visible');
  });
});

function checkViewports(scrollMode: TFmModalScroll): void {
  cy.getCy('modal').should('be.visible');

  if (scrollMode === 'content') {
    const vMargin = fmDefaultStyling.verticalMargin;

    cy.getCy('modal-body').invoke('outerHeight').should('eq', viewportHeight - vMargin * 2);
    cy.getCy('modal-content').should('have.class', 'scrollable');
    cy.getCy('modal').should('not.have.class', 'scrollable');

  } else {
    cy.getCy('modal-body').invoke('outerHeight').should('be.gt', viewportHeight);
    cy.getCy('modal-content').should('not.have.class', 'scrollable');
    cy.getCy('modal').should('have.class', 'scrollable');
  }
}
