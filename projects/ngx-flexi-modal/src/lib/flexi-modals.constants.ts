import {IFlexiModalButtonConfig, IFlexiModalCreateOptions,} from "./flexi-modals.models";

export enum FlexiModalType {
  Component = 'COMPONENT',
  Template = 'TEMPLATE',
}

export enum FlexiModalEventType {
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

export const flexiModalOptionsDefault: Partial<IFlexiModalCreateOptions<any>> = {
  closable: true,
  width: 'medium',
  height: 'fit-content',
  scroll: 'modal',
};

export const flexiModalButtonOptionsDefault: Partial<IFlexiModalButtonConfig> = {
  disabled: false,
  closeOnClick: true,
  theme: 'primary',
  position: 'right',
  onClick: () => {},
}
