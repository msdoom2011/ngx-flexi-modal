import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Component, signal, Type, viewChild } from '@angular/core';

import { FmModalComponent } from '../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import { provideFlexiModals } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import { initializeTemplateModals } from '../../support/helpers/common-helpers';
import {
  FmModalsOutletComponent
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import {
  FmModalBodyDirective
} from '../../../projects/ngx-flexi-modal/src/lib/components/modal/directives/fm-modal-body.directive';

describe('Option "opened"', () => {

  it('should be falsy by default', () => {
    initializeTemplateModals(ModalEmptyComponent);

    cy.getCy('modal').should('not.exist');
  });

  it('should be opened when specify a string as a value', () => {
    initializeApp(OpenedStaticComponent);

    cy.getCy('modal').should('be.visible');
  });

  it('should be opened or hidden according to "opened" bound value', () => {
    initializeApp(OpenedTwoWayBoundComponent);

    cy.getCy('modal').should('not.exist');
    setOpened(true);
    cy.getCy('modal').should('be.visible');
    setOpened(false);
    cy.getCy('modal').should('not.exist');

    function setOpened(value: boolean): void {
      cy.get('@fixture').then((fixture: any) => {
        fixture.component.opened.set(value);
      });
    }
  });

  it('should change "opened" bound value when modal opens and closes', () => {
    initializeApp(OpenedTwoWayBoundComponent);

    cy.getCy('modal').should('not.exist');

    switchModal(true);
    checkOpened(true);

    cy.getCy('modal').should('be.visible');

    switchModal(false);
    checkOpened(false);

    cy.getCy('modal').should('not.exist');

    cy.get('@fixture').then((fixture: any) => {
      fixture.component.opened.set(true);
    });

    cy.getCy('modal').should('be.visible');

    function switchModal(opened: boolean): void {
      cy.get('@fixture').then((fixture: any) => {
        opened
          ? fixture.component.modal().open()
          : fixture.component.modal().close();
      });
    }

    function checkOpened(value: boolean): void {
      cy.get('@fixture').then((fixture: any) => {
        expect(fixture.component.opened()).to.equal(value);
      });
    }
  });
});

function initializeApp(component: Type<any>): void {
  cy.mount(component, {
    imports: [
      component,
    ],
    providers: [
      provideNoopAnimations(),
      provideFlexiModals(),
    ],
  })
    .then((fixture) => {
      cy.wrap(fixture).as('fixture');
    });
}

@Component({
  standalone: true,
  imports: [
    FmModalsOutletComponent,
    FmModalComponent,
    FmModalBodyDirective,
  ],
  template: `
    <fm-modal opened="true">
      <div *fmModalBody>Modal Content!</div>
    </fm-modal>
    <fm-modals-outlet />
  `
})
class OpenedStaticComponent {
  public opened = signal(false);
}

@Component({
  standalone: true,
  imports: [
    FmModalsOutletComponent,
    FmModalComponent,
    FmModalBodyDirective,
  ],
  template: `
    <fm-modal [(opened)]="opened" #modal>
      <div *fmModalBody>Modal Content!</div>
    </fm-modal>
    <fm-modals-outlet />
  `
})
class OpenedTwoWayBoundComponent {
  public modal = viewChild<FmModalComponent>('modal');
  public opened = signal(false);
}
