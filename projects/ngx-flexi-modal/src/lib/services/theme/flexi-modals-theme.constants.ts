import {IFmModalStylingConfig, IFmModalColorScheme} from './flexi-modals-theme.definitions';

export const FM_DEFAULT_THEME = 'default';

export const fmDefaultColorScheme: IFmModalColorScheme = {
  spinner: '#c0c0c0',
  border: '#cccccc',
  backdrop: 'rgba(4, 67, 81, 0.5)',
  headerText: '#333333',
  headerBg: '#f0f0f0',
  bodyText: '#333333',
  bodyBg: '#ffffff',
  footerText: '#333333',
  footerBg: '#f0f0f0',
  actionBorder: '#f0f0f0',
  actionText: '#6da6ad',
  actionBg: '#f0f0f0',
  actionPrimaryBorder: '#6da6ad',
  actionPrimaryText: '#ffffff',
  actionPrimaryBg: '#6da6ad',
  actionFocusOutline: 'rgba(109, 166, 173, 0.4)',
}

export const fmDefaultStyling: IFmModalStylingConfig = {
  frameShadow: '0 5px 20px 0 rgba(0, 0, 0, 0.3)',
  frameBorder: false,
  frameRounding: 4,
  headerActionsPosition: 'inside',
  headerActionsWithBg: false,
  headerHeight: 40,
  headerFontSize: '1.17em',
  headerFontWeight: '600',
};

export const fmColorSchemeCssVars: (
  Record<keyof IFmModalColorScheme, string>
)= {
  spinner: '--fm-color-spinner',
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

export const fmStylingCssVars: (
  Record<keyof IFmModalStylingConfig, string>
) = {
  frameRounding: '--fm-frame-border-radius',
  frameShadow: '--fm-frame-box-shadow',
  headerHeight: '--fm-header-height',
  headerFontSize: '--fm-header-font-size',
  headerFontWeight: '--fm-header-font-weight',
  headerActionsPosition: '',
  headerActionsWithBg: '',
  frameBorder: '',
};

export const fmStylingCssValueGetters: (
  Record<keyof IFmModalStylingConfig, ((value: any) => string) | undefined>
) = {
  frameRounding: (rounding: number | boolean) => {
    return typeof rounding === 'number'
      ? rounding + 'px'
      : rounding
        ? fmDefaultStyling.frameRounding + 'px'
        : '0';
  },
  headerHeight: (height: number) => {
    return height >= 30 ? `${height}px` : '30px';
  },
  frameShadow: undefined,
  frameBorder: undefined,
  headerActionsPosition: undefined,
  headerActionsWithBg: undefined,
  headerFontSize: undefined,
  headerFontWeight: undefined,
}
