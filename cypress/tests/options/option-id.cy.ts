import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { ModalSimpleTextComponent } from '../../components/modals-templated/modals/modal-simple-text.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';

describe('Option "id"', () => {

  it('should be set a random id if custom is not specified (service)', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent).then(checkId.bind(undefined, undefined));
  });

  it('should be set a random id if custom is not specified (templated)', () => {
    initializeTemplateModals(ModalSimpleTextComponent, { inputs: { opened: true }});
    cy.get('@modal').then(checkId.bind(undefined, undefined));
  });

  it('should be set to the modal instance element (service)', () => {
    const id = 'custom-modal-id';

    initializeServiceModals();
    showComponent(SimpleTextComponent, { id }).then(checkId.bind(undefined, id));
  });

  it('should be set to the modal instance element (templated)', () => {
    const id = 'custom-modal-id';

    initializeTemplateModals(ModalSimpleTextComponent, { inputs: { id, opened: true }});
    cy.get('@modal').then(checkId.bind(undefined, id));
  });
});

function checkId(testId: string | undefined, modal: any): void {
  const id = testId || modal?.config().id;

  expect(id).to.ok;
  cy.getCy('modal').should('have.attr', 'id', id);
}
