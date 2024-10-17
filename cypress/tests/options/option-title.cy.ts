import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { withDefaultOptions } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';

describe('Option "title"', () => {

  it('should be empty by default in the service-created modal', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    checkTitle(undefined);
  });

  it('should be empty by default in the template-defined modal', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});
    checkTitle(undefined);
  });

  it('should be displayed according to the default options in service-created modal', () => {
    const title = 'Custom Title';

    initializeServiceModals(withDefaultOptions({ title }));
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    checkTitle(title);
  });

  it('should be displayed according to the default options in template-defined modal', () => {
    const title = 'Custom Title';

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }}, withDefaultOptions({ title }));
    checkTitle(title);
  });

  it('should be configurable in runtime in service-created modal', () => {
    const firstValue = 'Modal Title';
    const secondValue = 'Updated Modal Title with a lot of unnecessary words just to exceed the available header space';

    initializeServiceModals();
    showComponent(SimpleTextComponent, { title: firstValue })
      .then((modal: any) => cy.wrap(modal).as('modal'));

    checkTitle(firstValue);

    cy.get('@modal').then((modal: any) => modal.update({ title: secondValue }));
    cy.getCy('modal-title')
      .should('contain.text', secondValue)
      .then($title => expect($title.outerWidth()).to.lessThan(400));
  });

  it('should be configurable in runtime in template-defined modal', () => {
    const firstValue = 'Modal Title';
    const secondValue = 'Updated Modal Title with a lot of unnecessary words just to exceed the available header space';

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true, title: firstValue }});
    checkTitle(firstValue);

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { title: secondValue } );
      fixture.detectChanges();
    });

    cy.getCy('modal-title').then($title => expect($title.outerWidth()).to.lessThan(400));
    checkTitle(secondValue);
  });
});

function checkTitle(title: string | undefined): void {
  cy.get('@modal').then((modal: any) => expect(modal.config().title).to.equal(title));

  if (!title) {
    cy.getCy('modal-title').should('not.exist');

  } else {
    cy.getCy('modal-title').should('contain.text', title);
  }
}
