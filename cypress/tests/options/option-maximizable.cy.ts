import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';

describe('Option "maximizable"', () => {

  it('should be empty by default in the service-created modal', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    checkMaximizeBtn(false);

    cy.get('@modal').then((modal: any) => modal.update({ maximizable: true }));
    checkMaximizeBtn(true);
  });

  it('should be empty by default in the template-defined modal', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});
    checkMaximizeBtn(false);

    cy.get('@modal').then((modal: any) => modal.update({ maximizable: true }));
    checkMaximizeBtn(true);
  });

  it('should be displayed according to the default options in service-created modal', () => {
    const maximizable = true;

    initializeServiceModals(withDefaultOptions({ maximizable }));
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    checkMaximizeBtn(maximizable);
  });

  it('should be displayed according to the default options in template-defined modal', () => {
    const maximizable = true;

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }}, withDefaultOptions({ maximizable }));
    checkMaximizeBtn(maximizable);
  });

  it('should be configurable in runtime in service-created modal', () => {
    const firstValue = true;
    const secondValue = false;

    initializeServiceModals();
    showComponent(SimpleTextComponent, { maximizable: firstValue })
      .then((modal: any) => cy.wrap(modal).as('modal'));

    checkMaximizeBtn(firstValue);

    cy.get('@modal').then((modal: any) => modal.update({ maximizable: secondValue }));

    checkMaximizeBtn(secondValue);
  });

  it('should be configurable in runtime in template-defined modal', () => {
    const firstValue = true;
    const secondValue = false;

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true, maximizable: firstValue }});

    checkMaximizeBtn(firstValue);

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { maximizable: secondValue } );
      fixture.detectChanges();
    });

    checkMaximizeBtn(secondValue);
  });
});

function checkMaximizeBtn(maximizable: boolean): void {
  cy.get('@modal').then((modal: any) => expect(modal.config().maximizable).to.equal(maximizable));
  cy.getCy('modal-maximize-btn').should(`${ !maximizable ? 'not.' : '' }exist`);
}
