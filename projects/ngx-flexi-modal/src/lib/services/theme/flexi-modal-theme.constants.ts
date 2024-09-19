import {IFlexiModalColorScheme} from "./flexi-modal-theme.models";

export const FLEXI_MODAL_DEFAULT_THEME = 'default';

export const flexiModalDefaultColors: IFlexiModalColorScheme = {
  border: 'transparent',
  backdrop: 'rgba(4, 67, 81, 0.5)',
  headerText: '#333',
  headerBg: '#d9d9d9',
  bodyText: '#333',
  bodyBg: '#fff',
  footerText: '#333',
  footerBg: '#d9d9d9',
  actionBorder: 'transparent',
  actionText: '#6da6ad',
  actionBg: '#fff',
  actionPrimaryText: '#fff',
  actionPrimaryBg: '#6da6ad',
  actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
}

export const flexiModalCssVars: Record<keyof IFlexiModalColorScheme, string> = {
  border: '--fm-color-border',
  backdrop: '--fm-color-backdrop',
  headerText: '--fm-color-header-text',
  headerBg: '--fm-color-header-bg',
  bodyText: '--fm-color-body-text',
  bodyBg: '--fm-color-body-bg',
  footerText: '--fm-color-footer-text',
  footerBg: '--fm-color-footer-bg',
  actionBorder: '--fm-color-action-border',
  actionText: '--fm-color-action-text',
  actionBg: '--fm-color-action-bg',
  actionPrimaryText: '--fm-color-action-primary-text',
  actionPrimaryBg: '--fm-color-action-primary-bg',
  actionFocusOutline: '--fm-color-action-focus-outline',
};
