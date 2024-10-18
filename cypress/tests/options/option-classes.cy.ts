import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Component, signal } from '@angular/core';
import { MountResponse } from 'cypress/angular';

import { initializeServiceModals, initializeTemplateModals, showComponent } from '../../support/helpers/common-helpers';
import { FmModalComponent } from '../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import {
  provideFlexiModals,
  withDefaultOptions,
} from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import {
  FmModalsOutletComponent
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import {
  FmModalBodyDirective
} from '../../../projects/ngx-flexi-modal/src/lib/components/modal/directives/fm-modal-body.directive';

describe('Option "classes"', () => {

  it('should set classes to the service-created modal from default options', () => {
    const classes1 = [ 'custom-class-1', 'custom-class-2' ];
    const classes2 =  [ 'custom-class-3' ];

    initializeServiceModals(withDefaultOptions({ classes: classes1 }));
    showComponent(SimpleTextComponent).then((modal: any) => cy.wrap(modal).as('modal'));
    basicClassesCheck(classes1, classes2);
  });

  it('should set classes to the template-defined modal from default options', () => {
    const classes1 = ['custom-class-1', 'custom-class-2'];
    const classes2 =  [ 'custom-class-3' ];

    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }}, withDefaultOptions({ classes: classes1 }));
    basicClassesCheck(classes1, classes2);
  });

  it.only('should transfer classes from template-defined modal to modal instance element', () => {
    cy.mount(ModalWithStaticClassesComponent, {
      imports: [ ModalWithStaticClassesComponent ],
      providers: [
        provideNoopAnimations(),
        provideFlexiModals(),
      ],
    }).then((mountResponse: MountResponse<ModalWithStaticClassesComponent>) => {
      cy.wrap(mountResponse.fixture).as('fixture');
    });

    cy.getCy('modal').should('have.class', 'custom-class');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentInstance.addOptionalClass();
    });

    cy.getCy('modal').should('have.class', 'optional-custom-class');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentInstance.modalClasses.set([ 'test-1', 'test-2' ]);
    });

    cy.getCy('modal').should('have.class', 'optional-custom-class');
    cy.getCy('modal').should('have.class', 'test-1');
    cy.getCy('modal').should('have.class', 'test-2');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentInstance.modalClasses.set([ 'test-3' ]);
    });

    cy.getCy('modal').should('have.class', 'optional-custom-class');
    cy.getCy('modal').should('not.have.class', 'test-1');
    cy.getCy('modal').should('not.have.class', 'test-2');
    cy.getCy('modal').should('have.class', 'test-3');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentInstance.modalClasses.set([]);
      fixture.componentInstance.removeOptionalClass();
    });

    cy.getCy('modal').should('have.class', 'custom-class');
    cy.getCy('modal').should('not.have.class', 'optional-custom-class');
    cy.getCy('modal').should('not.have.class', 'test-1');
    cy.getCy('modal').should('not.have.class', 'test-2');
    cy.getCy('modal').should('not.have.class', 'test-3');
  });
});

function basicClassesCheck(classes1: Array<string>, classes2: Array<string>): void {
  checkClasses(classes1);

  cy.get('@modal').then((modal: any) => {
    modal.update({ classes: classes2 });
  });

  checkClasses(classes2);
  checkClasses(classes1, false);

  cy.get('@modal').then((modal: any) => {
    modal.update({ classes: [] });
  });

  checkClasses(classes1, false);
  checkClasses(classes2, false);
}

function checkClasses(classes: Array<string>, toBePresent: boolean = true): void {
  for (const cls of classes) {
    cy.getCy('modal').should((!toBePresent ? 'not.' : '') + 'have.class', cls);
  }
}

@Component({
  standalone: true,
  template: `
    <fm-modal
      opened="true"
      class="custom-class"
      [class.optional-custom-class]="isClassVisible()"
      [class]="modalClasses()"
    >
      <span *fmModalBody>Modal Content!</span>
    </fm-modal>
    <fm-modals-outlet />
  `,
  imports: [
    FmModalComponent,
    FmModalsOutletComponent,
    FmModalBodyDirective,
  ],
})
class ModalWithStaticClassesComponent {

  public isClassVisible = signal(false);
  public modalClasses = signal([]);

  public addOptionalClass(): void {
    this.isClassVisible.set(true);
  }

  public removeOptionalClass(): void {
    this.isClassVisible.set(false);
  }
}
