import {EnvironmentProviders, makeEnvironmentProviders, Provider} from '@angular/core';

import {IFmExtension, IFmModalOptions} from './services/modals/flexi-modals.definitions';
import {fmModalBasicExtension} from './extensions/basic/fm-modal-basic.extension';
import {
  IFmModalStylingOptions,
  IFmModalColorScheme,
  IFmModalThemeOptions
} from './services/theme/flexi-modals-theme.definitions';
import {
  FLEXI_MODAL_STYLING_OPTIONS,
  FLEXI_MODAL_COLOR_SCHEME,
  FLEXI_MODAL_DEFAULT_OPTIONS,
  FLEXI_MODAL_EXTENSION,
  FLEXI_MODAL_THEME
} from './flexi-modals.tokens';

/**
 * Registers flexi modals services in application
 *
 * @param { ...(<Array<Provider> | Provider) } providers
 * @returns EnvironmentProviders
 */
export function provideFlexiModals(...providers: Array<Array<Provider>> | Array<Provider>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLEXI_MODAL_EXTENSION, useValue: fmModalBasicExtension, multi: true },
    ...providers,
  ]);
}

/**
 * Allows to specify default options for any created flexi modal.
 *
 * @param { IFmModalOptions } options An object containing default modal option values
 * @returns Array<Provider>
 */
export function withDefaultOptions(options: IFmModalOptions<any>): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_DEFAULT_OPTIONS, useValue: options },
  ];
}

export function withColorScheme(colors: Partial<IFmModalColorScheme>): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_COLOR_SCHEME, useValue: colors },
  ];
}

export function withStyling(options: IFmModalStylingOptions): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_STYLING_OPTIONS, useValue: options },
  ];
}

export function withThemes(themes: Array<IFmModalThemeOptions>): Array<Provider> {
  return [
    ...themes.map(themeConfig => (
      { provide: FLEXI_MODAL_THEME, useValue: themeConfig, multi: true }
    )),
  ];
}

export function withExtensions(extensions: Array<IFmExtension<any>>): Array<Provider> {
  return extensions.map(extension => (
    { provide: FLEXI_MODAL_EXTENSION, useValue: extension, multi: true }
  ));
}
