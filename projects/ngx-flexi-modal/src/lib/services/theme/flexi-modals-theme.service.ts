import {computed, Inject, Injectable, Optional, signal} from "@angular/core";

import {FLEXI_MODAL_STYLING_OPTIONS, FLEXI_MODAL_COLOR_SCHEME, FLEXI_MODAL_THEME} from "../../flexi-modals.tokens";
import {normalizeOptions} from "../../tools/utils";
import {
  flexiModalCssStylesValueGetters,
  flexiModalDefaultStyles,
  flexiModalCssStylesVars,
  flexiModalCssColorsVars,
  flexiModalDefaultColors,
  FLEXI_MODAL_DEFAULT_THEME
} from "./flexi-modals-theme.constants";
import {
  IFlexiModalStylingOptions,
  IFlexiModalColorScheme,
  IFlexiModalTheme,
  IFlexiModalThemeOptions,
  IFlexiModalThemes
} from "./flexi-modals-theme.definitions";

@Injectable({
  providedIn: "root",
})
export class FlexiModalsThemeService {

  private readonly _themes = signal<IFlexiModalThemes>({});

  private readonly _themeName = signal<string>('');

  public readonly theme = computed<IFlexiModalTheme>(() => {
    return this._themes()[this._themeName()];
  });

  public readonly themeName = computed<string>(() => {
    return this._themeName();
  });

  public readonly themes = computed<IFlexiModalThemes>(() => {
    return this._themes();
  });

  constructor(
    @Optional() @Inject(FLEXI_MODAL_THEME) themeConfigs: Array<IFlexiModalThemeOptions>,
    @Optional() @Inject(FLEXI_MODAL_COLOR_SCHEME) defaultColorScheme: IFlexiModalColorScheme,
    @Optional() @Inject(FLEXI_MODAL_STYLING_OPTIONS) defaultStylingOptions: IFlexiModalStylingOptions,
  ) {
    if (themeConfigs?.length && (defaultColorScheme || defaultStylingOptions)) {
      console.warn(
        `Specified both providers "FLEXI_MODAL_COLOR_SCHEME" or "FLEXI_MODAL_STYLING_OPTIONS" ` +
        `and "FLEXI_MODAL_THEME". The "FLEXI_MODAL_COLOR_SCHEME" provider was ignored.`
      );
    }

    if (themeConfigs?.length) {
      this._initializeWithThemes(themeConfigs);

    } else if (defaultColorScheme) {
      this._initializeWithOptions(defaultColorScheme, defaultStylingOptions);

    } else {
      this._initializeWithDefaults();
    }
  }


  // Public methods

  public registerTheme(themeOptions: IFlexiModalThemeOptions): void {
    if (this.isThemeExist(themeOptions.name)) {
      throw new Error(`The flexi modal theme with name "${themeOptions.name}" is already registered!`);
    }

    this._themes.update(themes => {
      return {
        ...themes,
        [themeOptions.name]: this._composeThemeConfig(themeOptions.colors, themeOptions.styling)
      };
    });
  }

  public isThemeExist(themeName: string): boolean {
    return themeName in this._themes();
  }

  public getTheme(themeName: string): IFlexiModalTheme | undefined {
    return this._themes()[themeName];
  }

  public setTheme(themeName: string): void {
    if (!this.isThemeExist(themeName)) {
      throw new Error(`Unable to switch theme. Theme with '${themeName}' is not registered`);
    }

    this._themeName.set(themeName);
  }

  public applyThemeStyles(targetElement: HTMLElement, themeName?: string): void {
    if (
      !targetElement
      || (themeName && !this.isThemeExist(themeName))
    ) {
      return;
    }

    const theme = themeName ? this._themes()[themeName] : this.theme();

    this._applyThemeStyles(
      targetElement,
      theme.colors,
      flexiModalCssColorsVars
    );

    this._applyThemeStyles(
      targetElement,
      theme.styling,
      flexiModalCssStylesVars,
      flexiModalCssStylesValueGetters
    );
  }

  private _initializeWithDefaults(): void {
    this._themeName.set(FLEXI_MODAL_DEFAULT_THEME);
    this._themes.set({
      [FLEXI_MODAL_DEFAULT_THEME]: {
        colors: flexiModalDefaultColors,
        styling: flexiModalDefaultStyles,
      }
    });
  }


  // Private methods

  private _initializeWithOptions(
    colorsScheme: IFlexiModalColorScheme,
    stylingOptions: IFlexiModalStylingOptions,
  ): void {

    this._themeName.set(FLEXI_MODAL_DEFAULT_THEME);
    this._themes.set({
      [FLEXI_MODAL_DEFAULT_THEME]: this._composeThemeConfig(colorsScheme, stylingOptions),
    });
  }

  private _initializeWithThemes(themeConfigs: Array<IFlexiModalThemeOptions>): void {
    const themes: IFlexiModalThemes = {};
    let themeDefault = '';

    themeConfigs.forEach((themeConfig: IFlexiModalThemeOptions) => {
      if (!this._validateThemeConfig(themeConfig)) {
        return;
      }

      themes[themeConfig.name] = this._composeThemeConfig(themeConfig.colors, themeConfig.styling);

      if (themeConfig.default) {
        themeDefault = themeConfig.name;
      }
    });

    this._themes.set(themes);
    this._themeName.set(themeDefault || themeConfigs[0].name);
  }

  private _validateThemeConfig(themeConfig: IFlexiModalThemeOptions): boolean {
    if (!themeConfig.name || typeof themeConfig.name !== 'string') {
      console.warn(`"${themeConfig.name}" is not a valid theme name. This theme was skipped.`);

      return false;
    }

    return true;
  }

  private _applyThemeStyles<SchemeT extends Record<string, any>>(
    targetElement: HTMLElement,
    scheme: SchemeT,
    schemeMap: Record<keyof SchemeT, string>,
    schemeValuesMap?: Record<keyof SchemeT, ((value: any) => string) | undefined>,
  ): void {

    for (const propName in scheme) {
      const colorPropName = <keyof SchemeT>propName;

      if (
        !scheme[colorPropName]
        || !Object.prototype.hasOwnProperty.call(scheme, propName)
      ) {
        continue;
      }

      targetElement.style.setProperty(
        schemeMap[colorPropName],
        schemeValuesMap?.[colorPropName]
          ? schemeValuesMap[colorPropName](scheme[colorPropName])
          : scheme[colorPropName]
      );
    }
  }

  private _composeThemeConfig(
    colorsScheme: Partial<IFlexiModalColorScheme> | undefined,
    stylingOptions: IFlexiModalStylingOptions | undefined
  ): IFlexiModalTheme {

    return {
      colors: {
        ...flexiModalDefaultColors,
        ...(colorsScheme || {}),
      },
      styling: {
        ...flexiModalDefaultStyles,
        ...(stylingOptions
          ? normalizeOptions(stylingOptions, ['headerActions', 'frameShadow'])
          : {}
        )
      },
    }
  }
}
