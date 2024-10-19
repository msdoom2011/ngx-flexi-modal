import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';

describe('Option "closable"', () => {

  it('should be empty by default (service)', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    checkCloseBtn(true);

    cy.get('@modal').then((modal: any) => modal.update({ closable: false }));
    checkCloseBtn(false);

    cy.getCy('modal-header-actions').should('not.exist');
  });

  it('should be empty by default (templated)', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});
    checkCloseBtn(true);

    cy.get('@modal').then((modal: any) => modal.update({ closable: false }));
    checkCloseBtn(false);

    cy.getCy('modal-header-actions').should('not.exist');
  });

  it('should be displayed according to the default options (service)', () => {
    const closable = false;

    initializeServiceModals(withDefaultOptions({ closable }));
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    checkCloseBtn(closable);
  });

  it('should be displayed according to the default options (templated)', () => {
    const closable = false;

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }}, withDefaultOptions({ closable }));
    checkCloseBtn(closable);
  });

  it('should be configurable in runtime (service)', () => {
    const firstValue = false;
    const secondValue = true;

    initializeServiceModals();
    showComponent(SimpleTextComponent, { closable: firstValue })
      .then((modal: any) => cy.wrap(modal).as('modal'));

    checkCloseBtn(firstValue);

    cy.getCy('modal-closing-layer').should('not.exist');

    cy.get('@modal').then((modal: any) => modal.update({ closable: secondValue }));

    checkCloseBtn(secondValue);

    cy.getCy('modal-closing-layer').click();
    cy.getCy('modal').should('not.exist');
  });

  it('should be configurable in runtime (templated)', () => {
    const firstValue = false;
    const secondValue = true;

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true, closable: firstValue }});

    checkCloseBtn(firstValue);

    cy.getCy('modal-closing-layer').should('not.exist');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { closable: secondValue } );
      fixture.detectChanges();
    });

    checkCloseBtn(secondValue);

    cy.getCy('modal-closing-layer').click();
    cy.getCy('modal').should('not.exist');
  });
});

function checkCloseBtn(closable: boolean): void {
  cy.get('@modal').then((modal: any) => expect(modal.config().closable).to.equal(closable));
  cy.getCy('modal-close-btn').should(`${ !closable ? 'not.' : '' }exist`);
}
