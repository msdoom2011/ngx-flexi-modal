import {InjectionToken} from "@angular/core";

import {ISurveyModalExtension} from "./survey-modals.models";

export const SURVEY_MODAL_EXTENSION = new InjectionToken<Array<ISurveyModalExtension<any>>>(
  'Provider token to register modals which will be accessible using "show" method of ModalsService',
);
