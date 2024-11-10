import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { FmModalEventType } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.constants';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { FlexiModalsService } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.service';

describe('Option "onOpen"', () => {

  it('should call a callback after modal open (service)', () => {
    initializeServiceModals();

    const options = {
      onOpen: () => {},
    };

    cy.spy(options, 'onOpen').as('onOpenSpy');

    showComponent(SimpleTextComponent, options);

    cy.getCy('modal').should('be.visible');
    cy.get('@onOpenSpy')
      .should('be.calledOnce')
      .should('be.calledWith', Cypress.sinon.match.object)
        .its('firstCall.args.0')
        .should('deep.include', { type: FmModalEventType.Open });
  });

  it('should call a callback after modal open (templated)', () => {
    const outputs = {
      open: () => {},
    };

    cy.spy(outputs, 'open').as('onOpenSpy');

    initializeTemplateModals(ModalEmptyComponent, {
      inputs: { opened: true },
      outputs
    });

    cy.getCy('modal').should('be.visible');
    cy.get('@onOpenSpy')
      .should('be.calledOnce')
      .should('be.calledWith', Cypress.sinon.match.object)
        .its('firstCall.args.0')
        .should('deep.include', { type: FmModalEventType.Open });
  });

  it('should prevent modal open if opening prevented (service)', () => {
    initializeServiceModals();

    cy.inject(FlexiModalsService).then((modalsService) => {
      modalsService.events$.subscribe(($event) => {
        if ($event.type === FmModalEventType.BeforeOpen) {
          $event.preventDefault();
        }
      });
    });

    const options = {
      onOpen: () => {},
    };

    cy.spy(options, 'onOpen').as('onOpenSpy');

    showComponent(SimpleTextComponent, options);

    cy.getCy('modal').should('not.exist');
    cy.get('@onOpenSpy').should('not.be.called');
  });

  it('should prevent modal open if opening prevented (templated)', () => {
    const outputs = {
      open: () => {},
    };

    cy.spy(outputs, 'open').as('onOpenSpy');

    initializeTemplateModals(ModalEmptyComponent, { outputs });

    cy.inject(FlexiModalsService).then((modalsService) => {
      modalsService.events$.subscribe(($event) => {
        if ($event.type === FmModalEventType.BeforeOpen) {
          $event.preventDefault();
        }
      });
    });

    cy.get('@fixture').then(($fixture: any) => {
      $fixture.componentRef.setInput('inputs', { opened: true });
      $fixture.detectChanges();
    });

    cy.getCy('modal').should('not.exist');
    cy.get('@onOpenSpy').should('not.be.called');
  });

  it('should prevent modal open if opening propagation stopped (service)', () => {
    initializeServiceModals();

    cy.inject(FlexiModalsService).then((modalsService) => {
      modalsService.events$.subscribe(($event) => {
        if ($event.type === FmModalEventType.BeforeOpen) {
          $event.stopPropagation();
        }
      });
    });

    const options = {
      onOpen: () => {},
    };

    cy.spy(options, 'onOpen').as('onOpenSpy');

    showComponent(SimpleTextComponent, options);

    cy.getCy('modal').should('not.exist');
    cy.get('@onOpenSpy').should('not.be.called');
  });

  it('should prevent modal open if opening propagation stopped (templated)', () => {
    const outputs = {
      open: () => {},
    };

    cy.spy(outputs, 'open').as('onOpenSpy');

    initializeTemplateModals(ModalEmptyComponent, { outputs });

    cy.inject(FlexiModalsService).then((modalsService) => {
      modalsService.events$.subscribe(($event) => {
        if ($event.type === FmModalEventType.BeforeOpen) {
          $event.stopPropagation();
        }
      });
    });

    cy.get('@fixture').then(($fixture: any) => {
      $fixture.componentRef.setInput('inputs', { opened: true });
      $fixture.detectChanges();
    });

    cy.getCy('modal').should('not.exist');
    cy.get('@onOpenSpy').should('not.be.called');
  });
});
