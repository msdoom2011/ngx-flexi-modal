import {IFmModalActionConfig, IFmModalConfig,} from './flexi-modals.definitions';

export const FM_MODAL_WITH_COMPONENT_TYPE = 'COMPONENT';

export const FM_MODAL_WITH_TEMPLATE_TYPE = 'TEMPLATE';

export enum FmModalEventType {
  BeforeOpen = 'BEFORE_OPEN',
  Open = 'OPEN',
  BeforeClose = 'BEFORE_CLOSE',
  Close = 'CLOSE',
  Update = 'UPDATE',
}

// TODO: adjust modal window size. Make it configurable outside
export const fmModalWidthPresets = {
  large: '800px',
  big: '600px',
  medium: '500px',
  small: '440px',
  tiny: '300px',
}

export const fmModalOptionsDefault: IFmModalConfig = {
  id: '',
  title: undefined,
  actions: undefined,
  aliveUntil: undefined,
  headerTpl: undefined,
  footerTpl: undefined,
  actionsTpl: undefined,
  onClose: undefined,
  onOpen: undefined,
  animation: 'slide',
  position: 'top',
  width: 'fit-content',
  height: 'fit-content',
  scroll: 'content',
  spinner: 'round-dotted',
  maximized: false,
  closable: true,
  maximizable: false,
  classes: undefined,
  theme: undefined,
  data: {},
};

export const fmModalActionOptionsDefault: IFmModalActionConfig = {
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
