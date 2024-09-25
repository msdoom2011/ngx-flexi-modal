export type IFlexiModalThemes = Record<string, IFlexiModalTheme>;

export interface IFlexiModalTheme {
  colors: IFlexiModalColorScheme;
  styling: IFlexiModalStylingConfig;
}

export interface IFlexiModalThemeOptions {
  name: string;
  default?: boolean;
  colors?: Partial<IFlexiModalColorScheme>;
  styling?: IFlexiModalStylingOptions;
}

export interface IFlexiModalColorScheme {
  border: string;
  backdrop: string;
  headerText: string;
  headerBg: string;
  bodyText: string;
  bodyBg: string;
  footerText: string;
  footerBg: string;
  actionBorder: string;
  actionText: string;
  actionBg: string;
  actionPrimaryBorder: string;
  actionPrimaryText: string;
  actionPrimaryBg: string;
  actionFocusOutline: string;
}

export type IFlexiModalStylingOptions = Partial<IFlexiModalStylingConfig>;

export interface IFlexiModalStylingConfig {
  frameBorder: boolean;
  frameShadow: string | boolean;
  frameRounding: number | boolean;
  headerActions: 'outside' | 'inside' | boolean;
  headerActionsWithBg: boolean;
  headerHeight: number;
  headerFontSize: string;
  headerFontWeight: string;
}
