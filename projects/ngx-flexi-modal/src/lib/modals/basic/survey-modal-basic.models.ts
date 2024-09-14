import {Observable} from "rxjs";

import {SurveyModalButton} from "../../components/modal-container/survey-modal-button";
import {
  SurveyComponentModalContainerComponent
} from "../../components/modal-container/container-types/component-container/survey-component-modal-container.component";

export type TSurveyModalBasicIcon = keyof IModalBasicOptionsByTypes | null;
export type TSurveyModalBasicAlign = 'left' | 'center' | 'right';

export interface IModalBasicOptionsByTypes {
  error: ISurveyModalBasicOptions;
  warning: ISurveyModalBasicOptions;
  success: ISurveyModalBasicOptions;
  info: ISurveyModalBasicOptions;
  confirm: ISurveyModalConfirmOptions;
}

export interface ISurveyModalBasicOptions extends ISurveyModalBasicInputs {
  title?: string;
  onClose?: (modal: SurveyComponentModalContainerComponent<any>) => void;
  aliveUntil?: Observable<unknown>;
}

export interface ISurveyModalConfirmOptions extends ISurveyModalBasicOptions {
  onYesLabel?: string;
  onYes?: ($event: MouseEvent, button: SurveyModalButton) => void,
  onNoLabel?: string;
  onNo?: ($event: MouseEvent, button: SurveyModalButton) => void,
}

export interface ISurveyModalBasicInputs {
  message: string | Array<string>;
  messageAlign?: TSurveyModalBasicAlign;
  icon?: TSurveyModalBasicIcon;
}
