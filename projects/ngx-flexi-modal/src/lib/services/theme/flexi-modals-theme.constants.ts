import {IFlexiModalStylingConfig, IFlexiModalColorScheme} from "./flexi-modals-theme.definitions";

export const FLEXI_MODAL_DEFAULT_THEME = 'default';

export const flexiModalDefaultColors: IFlexiModalColorScheme = {
  border: '#ccc',
  backdrop: 'rgba(4, 67, 81, 0.5)',
  headerText: '#333',
  headerBg: '#f0f0f0',
  bodyText: '#333',
  bodyBg: '#fff',
  footerText: '#333',
  footerBg: '#f0f0f0',
  actionBorder: '#f0f0f0',
  actionText: '#6da6ad',
  actionBg: '#f0f0f0',
  actionPrimaryBorder: '#6da6ad',
  actionPrimaryText: '#fff',
  actionPrimaryBg: '#6da6ad',
  actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
}

export const flexiModalDefaultStyles: IFlexiModalStylingConfig = {
  frameShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
  frameBorder: false,
  frameRounding: 4,
  headerActions: 'inside',
  headerActionsWithBg: false,
  headerHeight: 40,
  headerFontSize: '1.17em',
  headerFontWeight: '600',
};

export const flexiModalCssColorsVars: (
  Record<keyof IFlexiModalColorScheme, string>
)= {
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
  actionPrimaryBorder: '--fm-color-action-primary-border',
  actionPrimaryText: '--fm-color-action-primary-text',
  actionPrimaryBg: '--fm-color-action-primary-bg',
  actionFocusOutline: '--fm-color-action-focus-outline',
};

export const flexiModalCssStylesVars: (
  Record<keyof IFlexiModalStylingConfig, string>
) = {
  frameRounding: '--fm-frame-border-radius',
  frameShadow: '--fm-frame-box-shadow',
  headerHeight: '--fm-header-height',
  headerFontSize: '--fm-header-font-size',
  headerFontWeight: '--fm-header-font-weight',
  headerActions: '',
  headerActionsWithBg: '',
  frameBorder: '',
};

export const flexiModalCssStylesValueGetters: (
  Record<keyof IFlexiModalStylingConfig, ((value: any) => string) | undefined>
) = {
  frameRounding: (rounding: number | undefined) => typeof rounding === 'number' ? rounding + 'px' : '0',
  headerHeight: (height: number) => height >= 30 ? `${height}px` : '30px',
  frameShadow: undefined,
  frameBorder: undefined,
  headerActions: undefined,
  headerActionsWithBg: undefined,
  headerFontSize: undefined,
  headerFontWeight: undefined,
}
