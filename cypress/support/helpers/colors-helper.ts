import { Provider } from '@angular/core';

import { ModalSimpleTextComponent } from '../../components/modals-templated/modals/modal-simple-text.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { initializeServiceModals, initializeTemplateModals, showComponent } from './common-helpers';
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
      label: (label: string) => label,
      initialize: ColorsHelper.initializeModal,
      templated: false,
    },
    {
      label: (label: string) => `${label} for template defined modal`,
      initialize: ColorsHelper.initializeModalTemplated,
      templated: true,
    },
  ];

  public static makeConfigs(includeTemplated: boolean): Array<IColorTestsConfig> {
    return !includeTemplated ? [this.configs[0]] : this.configs;
  }

  public static initializeModal(...providers: Array<Provider | Array<Provider>>): void {
    initializeServiceModals(...providers);

    showComponent(SimpleTextComponent, {
      title: 'Modal Title',
      maximizable: true,
      actions: [
        { label: 'Confirm', primary: true },
        { label: 'Cancel' },
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
    optionName: string,
    checkOption: (color: string, templated: boolean) => void
  ): void {

    const { label, initialize, templated } = config;

    it(label('check default value'), () => {
      initialize(withStyling({ frameBorder: true }));
      checkOption(fmDefaultColorScheme[<keyof IFmModalColorScheme>optionName], templated);
    });
  }

  public static checkColorSchemeValue(
    config: IColorTestsConfig,
    optionName: string,
    checkOption: (color: string, templated: boolean) => void
  ): void {

    const { label, initialize, templated } = config;

    it(label('check color scheme value'), () => {
      const color = 'rgb(255, 0, 0)';

      initialize(
        withColorScheme({ [optionName]: color }),
        withStyling({ frameBorder: true }),
      );
      checkOption(color, templated);
    });
  }

  public static checkThemeValues(
    config: IColorTestsConfig,
    optionName: string,
    checkOption: (color: string, templated: boolean) => void
  ): void {

    const { label, initialize, templated } = config;

    it(label('check theme values'), () => {
      const colors = {
        theme1: 'rgb(255, 0, 0)',
        theme2: 'rgb(0, 255, 0)',
      };
      const themes: Array<IFmModalThemeOptions> = [
        {
          name: 'theme1',
          colors: { [optionName]: colors.theme1 },
          styling: { frameBorder: true },
        },
        {
          name: 'theme2',
          default: true,
          colors: { [optionName]: colors.theme2 },
          styling: { frameBorder: true },
        },
      ];

      initialize(withThemes(themes));
      checkOption(colors.theme2, templated);

      cy.get('@modal').then((modal: any) => {
        modal.themes.setTheme('theme1');
      });

      checkOption(colors.theme1, templated);

      cy.get('@modal').then((modal: any) => {
        modal.themes.setTheme('theme2');
      });

      checkOption(colors.theme2, templated);
    });
  }
}
