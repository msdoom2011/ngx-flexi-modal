// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import code coverage support
import '@cypress/code-coverage/support';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/angular';
import { InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import Chainable = Cypress.Chainable;

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      inject: <T>(injectionToken: Type<T>) => Chainable<T>;
    }
  }
}

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('inject', (injectionToken: Type<any>): Chainable<any> => {
  return cy.wrap(TestBed.inject(injectionToken));
});

// Example use:
// cy.mount(MyComponent)
