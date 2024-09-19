import {EnvironmentProviders, makeEnvironmentProviders, Provider} from "@angular/core";

import {IFlexiModalColorScheme, IFlexiModalTheme} from "./services/theme/flexi-modal-theme.models";
import {flexiModalBasicExtension} from "./extensions/basic/flexi-modal-basic.extension";
import {IFlexiModalOptions} from "./flexi-modals.models";
import {
  FLEXI_MODAL_COLOR_SCHEME,
  FLEXI_MODAL_DEFAULT_OPTIONS,
  FLEXI_MODAL_EXTENSION,
  FLEXI_MODAL_THEME
} from "./flexi-modals.tokens";

/**
 * Registers flexi modals services in application
 *
 * @param { ...(<Array<Provider> | Provider) } providers
 * @returns EnvironmentProviders
 */
export function provideFlexiModals(...providers: Array<Array<Provider>> | Array<Provider>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLEXI_MODAL_EXTENSION, useValue: flexiModalBasicExtension, multi: true },
    ...providers,
  ]);
}

/**
 * Allows to specify default options for any created flexi modal.
 *
 * @param { IFlexiModalOptions } options An object containing default modal option values
 * @returns Array<Provider>
 */
export function withDefaultOptions(options: IFlexiModalOptions<any>): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_DEFAULT_OPTIONS, useValue: options },
  ];
}

export function withColorScheme(colors: Partial<IFlexiModalColorScheme>): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_COLOR_SCHEME, useValue: colors },
  ];
}

export function withThemes(themes: Array<IFlexiModalTheme>): Array<Provider> {
  return [
    ...themes.map(themeConfig => (
      { provide: FLEXI_MODAL_THEME, useValue: themeConfig, multi: true }
    ))
  ];
}
