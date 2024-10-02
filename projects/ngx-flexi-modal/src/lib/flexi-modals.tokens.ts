import {InjectionToken} from '@angular/core';

import {IFmExtension, IFmModalOptions} from './services/modals/flexi-modals.definitions';
import {
  IFmModalColorScheme,
  IFmModalStylingOptions,
  IFmModalThemeOptions
} from './services/theme/flexi-modals-theme.definitions';

export const FLEXI_MODAL_EXTENSION = new InjectionToken<Array<IFmExtension<any>>>(
  'Flexi modals extension',
);

export const FLEXI_MODAL_DEFAULT_OPTIONS = new InjectionToken<IFmModalOptions<any>>(
  'Flexi modal default options',
);

export const FLEXI_MODAL_COLOR_SCHEME = new InjectionToken<IFmModalColorScheme>(
  'Flexi modal color scheme',
);

export const FLEXI_MODAL_STYLING_OPTIONS = new InjectionToken<IFmModalStylingOptions>(
  'Flexi modal styling options',
);

export const FLEXI_MODAL_THEME = new InjectionToken<Array<IFmModalThemeOptions>>(
  'Flexi modal theme',
);
