import { Provider } from '@angular/core';

import { ModalSimpleTextComponent } from '../../components/modals-templated/modals/modal-simple-text.component';
import { SimpleTextComponent } from '../../components/modal-content/simple-text.component';
import { initializeServiceModals, initializeTemplateModals, showComponent } from './common-helpers';
import {
  fmDefaultStyling,
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.constants';
import {
  IFmModalStylingConfig,
  IFmModalStylingOptions,
  IFmModalThemeOptions,
} from '../../../projects/ngx-flexi-modal/src/lib/services/theme/flexi-modals-theme.definitions';
import { withStylingOptions, withThemes } from '../../../projects/ngx-flexi-modal/src/lib/flexi-modals.providers';

export interface IStylingTestsConfig {
  label(label: string): string;
  initialize(...providers: Array<Provider | Array<Provider>>): void;
  templated: boolean;
}

export class StylingHelper {

  public static configs: Array<IStylingTestsConfig> = [
    {
      label: (label: string) => `${label} (service)`,
      initialize: StylingHelper.initializeModal,
      templated: false,
    },
    {
      label: (label: string) => `${label} (templated)`,
      initialize: StylingHelper.initializeModalTemplated,
      templated: true,
    },
  ];

  public static makeConfigs(includeTemplated: boolean = true): Array<IStylingTestsConfig> {
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
          opened: true,
          maximizable: true,
        },
      },
      ...providers
    );

    cy.getCy('modal-body').should('be.visible');
  }

  public static checkDefaultValue(
    config: IStylingTestsConfig,
    optionName: string,
    checkOption: (optionValue: any, templated: boolean) => void,
    defaultStyling: IFmModalStylingOptions = {},
  ): void {

    const { label, initialize, templated } = config;

    it(label('check default value'), () => {
      initialize(withStylingOptions(defaultStyling));
      checkOption(fmDefaultStyling[<keyof IFmModalStylingConfig>optionName], templated);
    });
  }

  public static checkStylingValue(
    config: IStylingTestsConfig,
    optionName: string,
    optionValue: any,
    checkOption: (value: any, templated: boolean) => void,
    defaultStyling: IFmModalStylingOptions = {},
  ): void {

    const { label, initialize, templated } = config;

    it(label('check styling value'), () => {
      initialize(
        withStylingOptions({
          ...defaultStyling,
          [optionName]: optionValue
        }),
      );
      checkOption(optionValue, templated);
    });
  }

  public static checkThemeValues(
    config: IStylingTestsConfig,
    optionName: string,
    valuesByThemes: { [themeName: string]: any },
    checkOption: (value: any, templated: boolean) => void,
    defaultStyling: IFmModalStylingOptions = {},
  ): void {

    const { label, initialize, templated } = config;

    it(label('check theme values'), () => {
      const themes: Array<IFmModalThemeOptions> = [];

      for (const themeName in valuesByThemes) {
        if (!Object.prototype.hasOwnProperty.call(valuesByThemes, themeName)) {
          continue;
        }

        themes.push({
          name: themeName,
          styling: {
            ...defaultStyling,
            [optionName]: valuesByThemes[themeName],
          },
        });
      }

      initialize(withThemes(themes));

      for (let i = 0; i < themes.length; i++) {
        const theme = themes[i];

        checkOption(valuesByThemes[theme.name], templated);

        if (!themes[i + 1]) {
          break;
        }

        cy.get('@modal').then((modal: any) => {
          modal.themes.setTheme(themes[i + 1].name);
        });
      }
    });
  }
}
