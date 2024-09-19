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

export interface IFlexiModalTheme {
  name: string;
  default?: boolean;
  colors: IFlexiModalColorScheme;
}

export type IFlexiModalThemes = Record<string, IFlexiModalColorScheme>;
