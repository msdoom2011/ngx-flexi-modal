/// <reference types="cypress" />

import Chainable = Cypress.Chainable;
import { mount } from 'cypress/angular';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { cySelector } from './helpers/common-helpers';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      inject<T>(injectionToken: Type<T>): Chainable<T>;
      getCy<E extends Node = HTMLElement>(selector: string): Chainable<JQuery<E>>
    }
  }
}

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('inject', (injectionToken: Type<any>): Chainable<any> => {
  return cy.wrap(TestBed.inject(injectionToken));
});

Cypress.Commands.add('getCy', (cyIds: string): Chainable<JQuery<Node>> => {
  return cy.get(cySelector(cyIds));
});
