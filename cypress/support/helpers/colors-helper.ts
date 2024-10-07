import { Provider } from '@angular/core';

import { ModalSimpleTextComponent } from '../../components/modals/modal-simple-text/modal-simple-text.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text/simple-text.component';
import { initializeServiceModals, initializeTemplateModals, showComponent } from './helpers';
import {
  fmDefaultColorScheme
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';
import {
  IFmModalColorScheme,
  IFmModalThemeOptions,
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.definitions';
import {
  withColorScheme,
  withStyling,
  withThemes,
} from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';

export interface IColorTestsConfig {
  label(label: string): string;
  initialize(...providers: Array<Provider | Array<Provider>>): void;
  templated: boolean;
}

export class ColorsHelper {

  public static configs: Array<IColorTestsConfig> = [
    {
      label: (label: string) => `${label} for template defined modal`,
      initialize: ColorsHelper.initializeModal,
      templated: true,
    },
    {
      label: (label: string) => label,
      initialize: ColorsHelper.initializeModalTemplated,
      templated: false,
    },
  ];

  public static initializeModal(...providers: Array<Provider | Array<Provider>>): void {
    initializeServiceModals(...providers);

    showComponent(SimpleTextComponent, {
      title: 'Modal Title',
      maximizable: true,
      actions: [
        { label: 'Cancel' },
        { label: 'Confirm', primary: true },
      ],
    })
      .then(modal => {
        cy.wrap(modal).as('modal');
      });

    cy.getCy('modal-body').should('be.visible');
  }

  public static initializeModalTemplated(...providers: Array<Provider | Array<Provider>>): void {
    initializeTemplateModals(
      ModalSimpleTextComponent,
      {
        inputs: {
          maximizable: true,
        },
      },
      ...providers
    );

    cy.get('@modal').then((modal: any) => modal.open());
    cy.getCy('modal-body').should('be.visible');
  }

  public static checkDefaultValue(
    config: IColorTestsConfig,
    colorProp: string,
    checkColor: (color: string) => void
  ): void {

    const { label, initialize } = config;

    it(label('check default value'), () => {
      initialize(withStyling({ frameBorder: true }));
      checkColor(fmDefaultColorScheme[<keyof IFmModalColorScheme>colorProp]);
    });
  }

  public static checkColorSchemeValue(
    config: IColorTestsConfig,
    colorProp: string,
    checkColor: (color: string) => void
  ): void {

    const { label, initialize } = config;

    it(label('check color scheme value'), () => {
      const color = 'rgb(255, 0, 0)';

      initialize(
        withColorScheme({ [colorProp]: color }),
        withStyling({ frameBorder: true }),
      );
      checkColor(color);
    });
  }

  public static checkThemeValues(
    config: IColorTestsConfig,
    colorProp: string,
    checkColor: (color: string) => void
  ): void {

    const { label, initialize } = config;

    it(label('check theme values'), () => {
      const colors = {
        theme1: 'rgb(255, 0, 0)',
        theme2: 'rgb(0, 255, 0)',
      };
      const themes: Array<IFmModalThemeOptions> = [
        {
          name: 'theme1',
          colors: { [colorProp]: colors.theme1 },
          styling: { frameBorder: true },
        },
        {
          name: 'theme2',
          default: true,
          colors: { [colorProp]: colors.theme2 },
          styling: { frameBorder: true },
        },
      ];

      initialize(withThemes(themes));
      checkColor(colors.theme2);

      cy.get('@modal').then((modal: any) => {
        modal.themes.setTheme('theme1');
      });

      checkColor(colors.theme1);

      cy.get('@modal').then((modal: any) => {
        modal.themes.setTheme('theme2');
      });

      checkColor(colors.theme2);
    });
  }
}
