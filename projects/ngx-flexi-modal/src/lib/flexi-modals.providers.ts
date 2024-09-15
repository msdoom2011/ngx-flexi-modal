import {EnvironmentProviders, makeEnvironmentProviders, Provider} from "@angular/core";

import {flexiModalBasicExtension} from "./extensions/basic/flexi-modal-basic.extension";
import {FLEXI_MODAL_EXTENSION} from "./flexi-modals.tokens";
import {FlexiModalsService} from "./flexi-modals.service";

export function provideFlexiModals(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLEXI_MODAL_EXTENSION, useValue: flexiModalBasicExtension, multi: true },
    FlexiModalsService,
  ]);
}
