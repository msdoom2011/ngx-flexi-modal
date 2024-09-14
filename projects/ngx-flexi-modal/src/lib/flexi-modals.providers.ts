import {Provider} from "@angular/core";

import {flexiModalBasicExtension} from "./extensions/basic/flexi-modal-basic.extension";
import {FLEXI_MODAL_EXTENSION} from "./flexi-modals.tokens";
import {FlexiModalsService} from "./flexi-modals.service";

export function provideFlexiModals(): Array<Provider> {
  return [
    { provide: FLEXI_MODAL_EXTENSION, useValue: flexiModalBasicExtension, multi: true },
    FlexiModalsService,
  ];
}
