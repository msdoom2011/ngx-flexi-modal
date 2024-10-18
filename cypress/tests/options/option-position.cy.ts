import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import {
  fmModalOptionsDefault
} from '../../../projects/ngx-flexi-modal/src/lib/services/modals/flexi-modals.constants';

describe('Option "position"', () => {

  it('should has proper default position (service)', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent);

    cy.getCy('modal-layout').should('have.class', 'position-' + fmModalOptionsDefault.position);
  });

  it('should has proper default position (template)', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});

    cy.getCy('modal-layout').should('have.class', 'position-' + fmModalOptionsDefault.position);
  });

  it('should has proper redefined default position (service)', () => {
    initializeServiceModals(withDefaultOptions({ position: 'center' }));
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));

    cy.getCy('modal-layout').should('have.class', 'position-center');
    cy.get('@modal').then((modal: any) => modal.update({ position: 'top' }));
    cy.getCy('modal-layout').should('have.class', 'position-top');
  });

  it('should has proper redefined default position (template)', () => {
    initializeTemplateModals(
      ModalEmptyComponent,
      { inputs: { opened: true }},
      withDefaultOptions({ position: 'center' }),
    );

    cy.getCy('modal-layout').should('have.class', 'position-center');
    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { position: 'top' });
      fixture.detectChanges();
    });
    cy.getCy('modal-layout').should('have.class', 'position-top');
  });
});
