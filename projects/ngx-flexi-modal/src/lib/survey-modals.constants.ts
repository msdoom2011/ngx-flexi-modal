import {ISurveyModalButtonConfig, ISurveyModalCreateOptions,} from "./survey-modals.models";

export enum SurveyModalType {
  Component = 'COMPONENT',
  Template = 'TEMPLATE',
}

export enum SurveyModalEventType {
  BeforeOpen = 'BEFORE_OPEN',
  Open = 'OPEN',
  BeforeClose = 'BEFORE_CLOSE',
  Close = 'CLOSE',
  Update = 'UPDATE',
}

// TODO: adjust modal window size. Make it configurable outside
export const modalWidthPresets = {
  large: '800px',
  big: '600px',
  medium: '500px',
  small: '440px',
  tiny: '300px',
}

export const surveyModalOptionsDefault: Partial<ISurveyModalCreateOptions<any>> = {
  closable: true,
  width: 'medium',
  height: 'fit-content',
  scroll: 'modal',
};

export const surveyModalButtonOptionsDefault: Partial<ISurveyModalButtonConfig> = {
  disabled: false,
  closeOnClick: true,
  theme: 'primary',
  position: 'right',
  onClick: () => {},
}
