import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';

describe('Option "data"', () => {

  it('should be empty object by default (service)', () => {
    const data = { test: true };

    initializeServiceModals();
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));

    cy.getCy('modal').should('be.visible');
    cy.get('@modal').then((modal: any) => {
      expect(modal.config().data).to.deep.equal({});
      modal.update({ data });
    });

    cy.get('@modal').then((modal: any) => {
      expect(modal.config().data).to.deep.equal(data);
    });
  });

  it('should be empty object by default (templated)', () => {
    const data = { test: true };

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});

    cy.getCy('modal').should('be.visible');
    cy.get('@modal').then((modal: any) => {
      expect(modal.config().data).to.deep.equal({});
    });

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { data } );
      fixture.detectChanges();
    });
    cy.get('@modal').then((modal: any) => {
      expect(modal.config().data).to.deep.equal(data);
    });
  });

  it('should has a specified default value (service)', () => {
    const data = { test: true };

    initializeServiceModals(withDefaultOptions({ data }));
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));

    cy.getCy('modal').should('be.visible');
    cy.get('@modal').then((modal: any) => {
      expect(modal.config().data).to.deep.equal(data);
    });
  });

  it('should has a specified default value (templated)', () => {
    const data = { test: true };

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }}, withDefaultOptions({ data }));

    cy.getCy('modal').should('be.visible');
    cy.get('@modal').then((modal: any) => {
      expect(modal.config().data).to.deep.equal(data);
    });
  });
});
