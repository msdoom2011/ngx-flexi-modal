import {IFlexiModalActionConfig, IFlexiModalConfig,} from "./flexi-modals.definitions";

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

export const flexiModalOptionsDefault: IFlexiModalConfig<any> = {
  id: '',
  title: undefined,
  actions: undefined,
  onClose: undefined,
  onOpen: undefined,
  position: 'center',
  width: 'fit-content',
  height: 'fit-content',
  scroll: 'modal',
  stretch: false,
  closable: true,
  classes: undefined,
  aliveUntil: undefined,
  theme: undefined,
  data: {},
};

export const flexiModalActionOptionsDefault: IFlexiModalActionConfig = {
  id: '',
  label: '',
  icon: undefined,
  classes: undefined,
  disabled: false,
  closeOnClick: true,
  primary: false,
  position: 'right',
  onClick: undefined,
}
