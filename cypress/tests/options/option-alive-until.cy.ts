import { Subject } from 'rxjs';

import { cySelector, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { ModalSimpleTextComponent } from '../../components/modals-templated/modals/modal-simple-text.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';

describe('Option "openUntil"', () => {

  it(
    'should close the template-defined modal when its parent component destroys ' +
    'and a service-created modal when "openUntil" observable emits a value',
    () => {
    const destroy$ = new Subject<void>();

    initializeTemplateModals(ModalSimpleTextComponent, {
      inputs: {
        opened: true,
        id: 'templated-modal-id'
      },
    });

    cy.getCy('modal').should('be.visible').as('templatedModal');

    showComponent(SimpleTextComponent, {
      openUntil: destroy$,
    }).then((modal) => {
      cy.get(cySelector('modal') + '#' + modal?.id()).as('serviceModal');
    });

    cy.get('@component').then((testComponent: any) => {
      testComponent.destroyModal();
    });
    cy.get('@templatedModal').should('not.exist');
    cy.get('@serviceModal').should('be.visible').then(() => {
      destroy$.next();
      destroy$.complete();
    });

    cy.get('@serviceModal').should('not.exist');
  });
});
