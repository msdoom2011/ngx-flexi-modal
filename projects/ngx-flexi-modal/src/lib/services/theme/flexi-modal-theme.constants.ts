import {IFlexiModalColorScheme} from "./flexi-modal-theme.models";

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
