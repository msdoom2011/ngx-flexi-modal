import {InjectionToken} from "@angular/core";

import {IFlexiModalExtension} from "./flexi-modals.models";

export const FLEXI_MODAL_EXTENSION = new InjectionToken<Array<IFlexiModalExtension<any>>>(
  'Provider token to register modals which will be accessible using "show" method of ModalsService',
);
