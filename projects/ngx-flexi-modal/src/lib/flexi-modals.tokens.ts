import {InjectionToken} from "@angular/core";

import {IFlexiModalColorScheme, IFlexiModalTheme} from "./services/theme/flexi-modal-theme.models";
import {IFlexiModalExtension, IFlexiModalOptions} from "./flexi-modals.models";

export const FLEXI_MODAL_EXTENSION = new InjectionToken<Array<IFlexiModalExtension<any>>>(
  'Provider token to register modals which will be accessible using "show" method of ModalsService',
);

export const FLEXI_MODAL_DEFAULT_OPTIONS = new InjectionToken<IFlexiModalOptions<any>>(
  'Flexi modal default options',
);

export const FLEXI_MODAL_COLOR_SCHEME = new InjectionToken<IFlexiModalColorScheme>(
  'Flexi modal color scheme'
);

export const FLEXI_MODAL_THEME = new InjectionToken<Array<IFlexiModalTheme>>(
  'Flexi modal theme'
);
