import {InjectionToken} from '@angular/core';

import { IFmModalPresets, IFmModalOptions, TFmWidthPreset } from './services/modals/flexi-modals.definitions';
import { FmModalFactory } from './services/modals/factories/fm-modal.factory';
import {
  IFmModalColorScheme,
  IFmModalStylingOptions,
  IFmModalThemeOptions
} from './services/theme/flexi-modals-theme.definitions';

export const FLEXI_MODAL_FACTORY = new InjectionToken<Array<FmModalFactory<any>>>('FLEXI_MODAL_FACTORY');
export const FLEXI_MODAL_PRESET_COLLECTION = new InjectionToken<Array<IFmModalPresets<any>>>('FLEXI_MODAL_PRESET_COLLECTION');
export const FLEXI_MODAL_DEFAULT_OPTIONS = new InjectionToken<IFmModalOptions<any>>('FLEXI_MODAL_DEFAULT_OPTIONS');
export const FLEXI_MODAL_COLOR_SCHEME = new InjectionToken<IFmModalColorScheme>('FLEXI_MODAL_COLOR_SCHEME');
export const FLEXI_MODAL_STYLING_OPTIONS = new InjectionToken<IFmModalStylingOptions>('FLEXI_MODAL_STYLING_OPTIONS');
export const FLEXI_MODAL_THEME = new InjectionToken<Array<IFmModalThemeOptions>>('FLEXI_MODAL_THEME');
export const FLEXI_MODAL_WIDTH_PRESETS = new InjectionToken<Record<TFmWidthPreset, number>>('FLEXI_MODAL_WIDTH_PRESETS');
