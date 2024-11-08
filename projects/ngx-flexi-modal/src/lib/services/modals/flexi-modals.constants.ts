import { IFmModalActionConfig, IFmModalConfig } from './flexi-modals.definitions';

export enum FmModalType {
  Component = 'COMPONENT',
  Template = 'TEMPLATE',
}

export enum FmModalEventType {
  BeforeOpen = 'BEFORE_OPEN',
  Open = 'OPEN',
  BeforeClose = 'BEFORE_CLOSE',
  Close = 'CLOSE',
  Ready = 'READY',
  Active = 'ACTIVE',
  Update = 'UPDATE',
  ContentChange = 'CONTENT_CHANGE',
  MaximizedChange = 'MAXIMIZED_CHANGE',
}

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
  autofocus: false,
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
  autofocus: false,
  closeOnClick: true,
  primary: false,
  position: 'right',
  onClick: undefined,
};
