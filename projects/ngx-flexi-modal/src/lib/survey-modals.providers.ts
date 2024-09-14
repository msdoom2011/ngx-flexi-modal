import {Provider} from "@angular/core";

import {SurveyModalsService} from "./survey-modals.service";
import {SURVEY_MODAL_EXTENSION} from "./survey-modals.tokens";
import {modalBasicExtension} from "./modals/basic/survey-modal-basic.extension";

export function provideSurveyModals(): Array<Provider> {
  return [
    { provide: SURVEY_MODAL_EXTENSION, useValue: modalBasicExtension, multi: true },
    SurveyModalsService,
  ];
}
