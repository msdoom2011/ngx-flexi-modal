import {computed, Inject, Injectable, Optional, Signal, signal} from "@angular/core";

import {FLEXI_MODAL_DEFAULT_THEME, flexiModalCssVars, flexiModalDefaultColors} from "./flexi-modal-theme.constants";
import {IFlexiModalColorScheme, IFlexiModalTheme, IFlexiModalThemes} from "./flexi-modal-theme.models";
import {FLEXI_MODAL_COLOR_SCHEME, FLEXI_MODAL_THEME} from "../../flexi-modals.tokens";

@Injectable({
  providedIn: "root",
})
export class FlexiModalThemeService {

  private readonly _themes = signal<IFlexiModalThemes>({});

  private readonly _themeName = signal<string>('');

  public readonly theme = computed<IFlexiModalColorScheme>(() => {
    return this._themes()[this._themeName()];
  });

  public get themeName(): Signal<string> {
    return this._themeName.asReadonly();
  }

  constructor(
    @Optional() @Inject(FLEXI_MODAL_THEME) themeConfigs: Array<IFlexiModalTheme>,
    @Optional() @Inject(FLEXI_MODAL_COLOR_SCHEME) defaultColorScheme: IFlexiModalColorScheme,
  ) {
    if (themeConfigs?.length && defaultColorScheme) {
      console.warn(
        `Specified both providers "FLEXI_MODAL_COLOR_SCHEME" and "FLEXI_MODAL_THEME". ` +
        `The "FLEXI_MODAL_COLOR_SCHEME" provider was ignored.`
      );
    }

    if (themeConfigs?.length) {
      this._initializeWithThemes(themeConfigs);

    } else if (defaultColorScheme) {
      this._initializeWithColors(defaultColorScheme);

    } else {
      this._initializeWithDefaults();
    }
  }

  public isThemeExist(themeName: string): boolean {
    return themeName in this._themes();
  }

  public setTheme(themeName: string): void {
    if (!this.isThemeExist(themeName)) {
      throw new Error(`Unable to switch theme. Theme with '${themeName}' is not registered`);
    }

    this._themeName.set(themeName);
  }

  public applyTheme(element: HTMLElement, themeName?: string): void {
    if (
      !element
      || (themeName && !this.isThemeExist(themeName))
    ) {
      return;
    }

    const colors = themeName ? this._themes()[themeName] : this.theme();

    for (const propName in colors) {
      if (!Object.prototype.hasOwnProperty.call(colors, propName)) {
        continue;
      }

      const colorPropName = <keyof IFlexiModalColorScheme>propName;

      element.style.setProperty(
        flexiModalCssVars[colorPropName],
        colors[colorPropName]
      );
    }
  }

  private _initializeWithDefaults(): void {
    this._themeName.set(FLEXI_MODAL_DEFAULT_THEME);
    this._themes.set({ [FLEXI_MODAL_DEFAULT_THEME]: flexiModalDefaultColors });
  }

  private _initializeWithColors(colorsScheme: IFlexiModalColorScheme): void {
    this._themeName.set(FLEXI_MODAL_DEFAULT_THEME);
    this._themes.set({ [FLEXI_MODAL_DEFAULT_THEME]: { ...flexiModalDefaultColors, ...colorsScheme }});
  }

  private _initializeWithThemes(themeConfigs: Array<IFlexiModalTheme>): void {
    const themes: IFlexiModalThemes = {};
    let themeDefault = '';

    themeConfigs.forEach((themeConfig: IFlexiModalTheme) => {
      if (!this._validateThemeConfig(themeConfig)) {
        return;
      }

      themes[themeConfig.name] = themeConfig.colors;

      if (themeConfig.default) {
        themeDefault = themeConfig.name;
      }
    });

    this._themes.set(themes);
    this._themeName.set(themeDefault || themeConfigs[0].name);
  }

  private _validateThemeConfig(themeConfig: IFlexiModalTheme): boolean {
    if (!themeConfig.name || typeof themeConfig.name !== 'string') {
      console.warn(`"${themeConfig.name}" is not a valid theme name. This theme was skipped.`);

      return false;
    }

    return true;
  }
}
