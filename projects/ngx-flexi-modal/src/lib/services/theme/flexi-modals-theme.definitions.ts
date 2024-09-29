export type IFmModalThemes = Record<string, IFmModalTheme>;
export type TFmModalHeaderActionsPosition = 'outside' | 'inside';
export type TFmModalSpinnerType = 'round-dotted' | 'round-dashed' | 'linear-dotted' | 'linear-dashed';

export interface IFmModalTheme {
  colors: IFmModalColorScheme;
  styling: IFmModalStylingConfig;
}

export interface IFmModalThemeOptions {
  name: string;
  default?: boolean;
  colors?: Partial<IFmModalColorScheme>;
  styling?: IFmModalStylingOptions;
}

export interface IFmModalColorScheme {
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

export type IFmModalStylingOptions = Partial<IFmModalStylingConfig>;

export interface IFmModalStylingConfig {
  frameBorder: boolean;
  frameShadow: string | boolean;
  frameRounding: number | boolean;
  spinnerType: TFmModalSpinnerType;
  headerActions: TFmModalHeaderActionsPosition | boolean;
  headerActionsWithBg: boolean;
  headerHeight: number;
  headerFontSize: string;
  headerFontWeight: string;
}
