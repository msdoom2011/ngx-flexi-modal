import {IFlexiModalActionConfig, IFlexiModalConfig,} from "./flexi-modals.definitions";

export const MODAL_WITH_COMPONENT_TYPE = 'COMPONENT';

export const MODAL_WITH_TEMPLATE_TYPE = 'TEMPLATE';

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
  animation: 'slide',
  position: 'top',
  width: 'fit-content',
  height: 'fit-content',
  scroll: 'content',
  maximized: false,
  closable: true,
  maximizable: false,
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
