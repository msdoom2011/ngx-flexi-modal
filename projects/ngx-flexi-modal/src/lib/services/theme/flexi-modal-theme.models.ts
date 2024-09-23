export type TFlexiModalCloseButtonPosition = 'outside' | 'inside';
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
  actionPrimaryText: string;
  actionPrimaryBg: string;
  actionFocusOutline: string;
}

export type IFlexiModalStylingOptions = (
  Partial<Omit<IFlexiModalStylingConfig, 'closeBtn'>>
  & { closeBtn?: Partial<IFlexiModalCloseButtonConfig> }
);

export interface IFlexiModalStylingConfig {
  frameBorder: boolean;
  frameShadow: string | boolean;
  frameRounding: number | boolean;
  closeBtn: IFlexiModalCloseButtonConfig | boolean | null;
}

export interface IFlexiModalCloseButtonConfig {
  // TODO: needs to be implemented!!!
  label: string | undefined;
  position: TFlexiModalCloseButtonPosition;
}
