import { TestBed } from '@angular/core/testing';
import { filter } from 'rxjs';

import { FlexiModalsService } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.service';
import { FmModalEventType } from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.constants';
import { ModalSimpleTextComponent } from '../../components/modals-templated/modals/modal-simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import {
  cySelector,
  initializeServiceModals,
  initializeTemplateModals,
  showComponent,
} from '../../support/helpers/common-helpers';

describe('Option "onClose"', () => {

  it('should trigger callback on modal close (service)', () => {
    initializeServiceModals();

    const options = {
      onClose: () => {},
    };

    cy.spy(options, 'onClose').as('onCloseSpy');

    showComponent(SimpleTextComponent, options);

    cy.getCy('modal').should('be.visible');
    cy.getCy('modal-close-btn').click();
    cy.getCy('modal').should('not.exist');

    cy.get('@onCloseSpy')
      .should('be.calledOnce')
      .should('be.calledWith', Cypress.sinon.match.object)
        .its('firstCall.args.0')
        .should('deep.include', { type: FmModalEventType.BeforeClose });
  });

  it('should trigger callback on modal close (service)', () => {
    const outputs = {
      close: () => {},
    };

    cy.spy(outputs, 'close').as('onCloseSpy');

    initializeTemplateModals(ModalEmptyComponent, {
      inputs: { opened: true },
      outputs
    });

    cy.getCy('modal').should('be.visible');
    cy.getCy('modal-close-btn').click();
    cy.getCy('modal').should('not.exist');

    cy.get('@onCloseSpy')
      .should('be.calledOnce')
      .should('be.calledWith', Cypress.sinon.match.object)
        .its('firstCall.args.0')
        .should('deep.include', { type: FmModalEventType.Close });
  });

  it('should not trigger callback if modal close prevented (templated)', () => {
    const templatedModalId = 'templated-modal-id';
    const innerModalId = 'inner-modal-id';
    const outputs = {
      close: () => {},
    };

    cy.spy(outputs, 'close').as('onCloseSpy');

    initializeTemplateModals(ModalSimpleTextComponent, { inputs: { id: templatedModalId }, outputs });

    cy.inject(FlexiModalsService).then((modalsService) => {
      modalsService.events$
        .pipe(filter($event => $event.id === templatedModalId))
        .subscribe(($event) => {
          if ($event.type === FmModalEventType.BeforeClose) {
            const modalsService = TestBed.inject(FlexiModalsService);

            modalsService.show(SimpleTextComponent, { id: innerModalId });
            $event.preventDefault();
          }
        });
    });

    cy.get('@fixture').then(($fixture: any) => {
      $fixture.componentRef.setInput('inputs', { opened: true });
      $fixture.detectChanges();
    });

    cy.get(cySelector('modal') + `#${templatedModalId}`).should('be.visible');
    cy.getCy('modal').should('have.length', 1);
    cy.getCy('modal-close-btn').click();

    cy.get('@onCloseSpy').should('not.be.called');
    cy.getCy('modal').should('have.length', 2);

    cy.get(cySelector('modal') + `#${templatedModalId}`).should('be.visible');
    cy.get(cySelector('modal') + `#${innerModalId}`).should('be.visible');
  });

  it('should not trigger callback if modal close propagation stopped', () => {
    const outputs = {
      close: () => {},
    };

    cy.spy(outputs, 'close').as('onCloseSpy');

    initializeTemplateModals(ModalEmptyComponent, { outputs });

    cy.inject(FlexiModalsService).then((modalsService) => {
      modalsService.events$.subscribe(($event) => {
        if ($event.type === FmModalEventType.BeforeClose) {
          $event.stopPropagation();
        }
      });
    });

    cy.get('@fixture').then(($fixture: any) => {
      $fixture.componentRef.setInput('inputs', { opened: true });
      $fixture.detectChanges();
    });

    cy.getCy('modal').should('be.visible');
    cy.getCy('modal-close-btn').click();

    cy.get('@onCloseSpy').should('not.be.called');
    cy.getCy('modal').should('be.visible');
  });
});
