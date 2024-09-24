import {InjectionToken} from "@angular/core";

import {IFlexiModalExtension, IFlexiModalOptions} from "./services/modals/flexi-modals.definitions";
import {
  IFlexiModalStylingConfig, IFlexiModalStylingOptions,
  IFlexiModalColorScheme,
  IFlexiModalThemeOptions
} from "./services/theme/flexi-modals-theme.definitions";

export const FLEXI_MODAL_EXTENSION = new InjectionToken<Array<IFlexiModalExtension<any>>>(
  'Provider token to register modals which will be accessible using "show" method of ModalsService',
);

export const FLEXI_MODAL_DEFAULT_OPTIONS = new InjectionToken<IFlexiModalOptions<any>>(
  'Flexi modal default options',
);

export const FLEXI_MODAL_COLOR_SCHEME = new InjectionToken<IFlexiModalColorScheme>(
  'Flexi modal color scheme',
);

export const FLEXI_MODAL_STYLING_OPTIONS = new InjectionToken<IFlexiModalStylingOptions>(
  'Flexi modal styling options',
);

export const FLEXI_MODAL_THEME = new InjectionToken<Array<IFlexiModalThemeOptions>>(
  'Flexi modal theme',
);
