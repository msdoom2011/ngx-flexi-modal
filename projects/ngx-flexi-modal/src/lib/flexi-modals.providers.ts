import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';

import { IFmModalPresets, IFmModalOptions, TFmWidthPreset } from './services/modals/flexi-modals.definitions';
import { FmModalWithComponentFactory } from './services/modals/factories/fm-modal-with-component.factory';
import { FmModalWithTemplateFactory } from './services/modals/factories/fm-modal-with-template.factory';
import { FmModalPresetsFactory } from './services/modals/factories/fm-modal-presets.factory';
import { fmModalBasicPresets } from './presets/basic/fm-modal-basic.presets';
import {
  IFmModalColorScheme,
  IFmModalStylingOptions,
  IFmModalThemeOptions,
} from './services/theme/flexi-modals-theme.definitions';
import {
  FLEXI_MODAL_COLOR_SCHEME,
  FLEXI_MODAL_DEFAULT_OPTIONS,
  FLEXI_MODAL_PRESET_COLLECTION,
  FLEXI_MODAL_FACTORY,
  FLEXI_MODAL_STYLING_OPTIONS,
  FLEXI_MODAL_THEME,
  FLEXI_MODAL_WIDTH_PRESETS,
} from './flexi-modals.tokens';

/**
 * Registers flexi modals services in application
 *
 * @param { ...(<Array<Provider> | Provider) } providers
 * @returns EnvironmentProviders
 */
export function provideFlexiModals(...providers: Array<Array<Provider>> | Array<Provider>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLEXI_MODAL_PRESET_COLLECTION, useValue: fmModalBasicPresets, multi: true },
    { provide: FLEXI_MODAL_FACTORY, useClass: FmModalWithComponentFactory, multi: true },
    { provide: FLEXI_MODAL_FACTORY, useClass: FmModalWithTemplateFactory, multi: true },
    { provide: FLEXI_MODAL_FACTORY, useClass: FmModalPresetsFactory, multi: true },
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

export function withStylingOptions(options: IFmModalStylingOptions): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_STYLING_OPTIONS, useValue: options },
  ];
}

export function withColorScheme(colors: Partial<IFmModalColorScheme>): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_COLOR_SCHEME, useValue: colors },
  ];
}

export function withWidthPresets(presets: Record<TFmWidthPreset, number>): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_WIDTH_PRESETS, useValue: presets },
  ];
}

export function withThemes(themes: Array<IFmModalThemeOptions>): Array<Provider> {
  return [
    ...themes.map(themeConfig => (
      { provide: FLEXI_MODAL_THEME, useValue: themeConfig, multi: true }
    )),
  ];
}

export function withModalPresets(presetCollections: Array<IFmModalPresets<any>>): Array<Provider> {
  return presetCollections.map(presetCollection => (
    { provide: FLEXI_MODAL_PRESET_COLLECTION, useValue: presetCollection, multi: true }
  ));
}
