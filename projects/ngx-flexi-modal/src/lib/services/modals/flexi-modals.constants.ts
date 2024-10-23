import { IFmModalActionConfig, IFmModalConfig, TFmWidthPreset } from './flexi-modals.definitions';

export const FM_MODAL_WITH_COMPONENT_TYPE = 'COMPONENT';

export const FM_MODAL_WITH_TEMPLATE_TYPE = 'TEMPLATE';

export enum FmModalEventType {
  BeforeOpen = 'BEFORE_OPEN',
  Open = 'OPEN',
  BeforeClose = 'BEFORE_CLOSE',
  Close = 'CLOSE',
  Update = 'UPDATE',
  Maximize = 'MAXIMIZE',
  Minimize = 'MINIMIZE',
}

export const fmModalWidthPresets: Record<TFmWidthPreset, number> = {
  large: 1280,
  big: 960,
  medium: 768,
  small: 568,
  tiny: 428,
};

export const fmModalOptionsDefault: IFmModalConfig = {
  id: '',
  title: undefined,
  actions: undefined,
  openUntil: undefined,
  headerTpl: undefined,
  footerTpl: undefined,
  actionsTpl: undefined,
  onClose: undefined,
  onOpen: undefined,
  onMaximize: undefined,
  onMinimize: undefined,
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
};
