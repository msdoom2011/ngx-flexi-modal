import {
  cySelector,
  initializeServiceModals,
  initializeTemplateModals,
  showComponent,
} from '../../support/helpers/common-helpers';
import { withDefaultOptions, withThemes } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { ModalEmptyComponent } from '../../components/modals-templated/modals/modal-empty.component';
import {
  FM_DEFAULT_THEME
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';

describe('Option "theme"', () => {

  it('should be empty and the modal should use the global theme setting (service)', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent);

    cy.getCy('modal').should('be.visible');

    checkOutletTheme(FM_DEFAULT_THEME);
    checkModalTheme(FM_DEFAULT_THEME, false);
  });

  it('should be empty and the modal should use the global theme setting (templated)', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true }});

    cy.getCy('modal').should('be.visible');

    checkOutletTheme(FM_DEFAULT_THEME);
    checkModalTheme(FM_DEFAULT_THEME, false);
  });

  it.only('should be set via the default modal options configuration (service)', () => {
    initializeServiceModals(
      withDefaultOptions({ theme: 'dark' }),
      withThemes([
        { name: 'light', default: true },
        { name: 'dark' },
      ]),
    ).then((mountResult) => {
      cy.wrap(mountResult.fixture).as('fixture');
    });

    showComponent(SimpleTextComponent)
      .then((modal: any) => cy.wrap(modal).as('modal'));

    cy.getCy('modal').should('be.visible');

    checkOutletTheme('light');
    checkModalTheme('dark');

    cy.get('@modal').then((modal: any) => modal.update({ theme: 'light' }));
    cy.get('@fixture').then((fixture: any) => fixture.detectChanges());

    checkOutletTheme('light');
    checkModalTheme('light');
    checkModalTheme('dark', false);
  });

  it('should be set via the default modal options configuration (templated)', () => {
    initializeTemplateModals(
      ModalEmptyComponent,
      { inputs: { opened: true, id: 'templated-modal' }},
      withDefaultOptions({ theme: 'dark' }),
      withThemes([
        { name: 'light', default: true },
        { name: 'dark' },
      ]),
    );
    showComponent(SimpleTextComponent);

    cy.get(cySelector('modal') + '#templated-modal').should('be.visible');

    checkOutletTheme('light');
    checkModalTheme('dark');

    cy.get('@fixture').then((fixture: any) => {
      fixture.componentRef.setInput('inputs', { theme: 'light' } );
      fixture.detectChanges();
    });

    checkOutletTheme('light');
    checkModalTheme('light');
    checkModalTheme('dark', false);
  });

  it('should ignore the invalid theme name (service)', () => {
    initializeServiceModals();
    showComponent(SimpleTextComponent, { theme: 'test' });

    checkOutletTheme(FM_DEFAULT_THEME);
    checkModalTheme(FM_DEFAULT_THEME, false);
    checkModalTheme('test', false);
  });

  it('should ignore the invalid theme name (templated)', () => {
    initializeTemplateModals(ModalEmptyComponent, { inputs: { opened: true, theme: 'test' }});

    checkOutletTheme(FM_DEFAULT_THEME);
    checkModalTheme(FM_DEFAULT_THEME, false);
    checkModalTheme('test', false);
  });
});

function checkOutletTheme(themeName: string, presence: boolean = true): void {
  cy.getCy('modals-outlet')
    .invoke('attr', 'class')
    .then((className: any) => {
      presence
        ? expect(className).to.contain('fm-modal-theme--' + themeName)
        : expect(className).not.to.contain('fm-modal-theme--' + themeName);
    });
}

function checkModalTheme(themeName: string, presence: boolean = true): void {
  cy.getCy('modal')
    .invoke('attr', 'class')
    .then((className: any) => {
      presence
        ? expect(className).to.contain('fm-modal-theme--' + themeName)
        : expect(className).not.to.contain('fm-modal-theme--' + themeName);
    });
}
