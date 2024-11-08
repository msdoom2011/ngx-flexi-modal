import { computed, inject, Injectable, signal } from '@angular/core';

import { appendHeaderStyleElement, generateRandomNumber, normalizeOptions } from '../../tools/utils';
import { TFmWidthPreset } from '../modals/flexi-modals.definitions';
import {
  FLEXI_MODAL_COLOR_SCHEME,
  FLEXI_MODAL_STYLING_OPTIONS,
  FLEXI_MODAL_THEME,
  FLEXI_MODAL_WIDTH_PRESETS,
} from '../../flexi-modals.tokens';
import {
  FM_DEFAULT_THEME,
  fmColorSchemeCssVars,
  fmDefaultColorScheme,
  fmDefaultStyling,
  fmModalWidthPresets,
  fmStylingCssValueGetters,
  fmStylingCssVars,
} from './flexi-modals-theme.constants';
import {
  IFmModalColorScheme,
  IFmModalStylingOptions,
  IFmModalTheme,
  IFmModalThemeOptions,
  IFmModalThemes,
} from './flexi-modals-theme.definitions';

@Injectable({
  providedIn: 'root',
})
export class FlexiModalsThemeService {

  // Signals
  private readonly _themes = signal<IFmModalThemes>({});
  private readonly _themeName = signal<string>('');
  private readonly _widthPresets = signal<Record<TFmWidthPreset, number>>(fmModalWidthPresets);

  // Private props
  private readonly _instanceId = generateRandomNumber();
  private _styleElement: HTMLStyleElement | null = null;

  constructor() {
    const themeConfigs = inject<Array<IFmModalThemeOptions>>(FLEXI_MODAL_THEME, { optional: true });
    const defaultColorScheme = inject<IFmModalColorScheme>(FLEXI_MODAL_COLOR_SCHEME, { optional: true });
    const defaultStylingOptions = inject<IFmModalStylingOptions>(FLEXI_MODAL_STYLING_OPTIONS, { optional: true });
    const widthPresets = inject<Record<TFmWidthPreset, number>>(FLEXI_MODAL_WIDTH_PRESETS, { optional: true });

    if (themeConfigs?.length && (defaultColorScheme || defaultStylingOptions)) {
      console.warn(
        'Specified both providers "FM_MODAL_COLOR_SCHEME" or "FM_MODAL_STYLING_OPTIONS" ' +
        'and "FM_MODAL_THEME". The "FM_MODAL_COLOR_SCHEME" provider was ignored.'
      );
    }

    if (widthPresets) {
      this._initializeWidthPresets(widthPresets);
    }

    if (themeConfigs?.length) {
      this._initializeWithThemes(themeConfigs);

    } else if (defaultColorScheme || defaultStylingOptions) {
      this._initializeWithOptions(defaultColorScheme, defaultStylingOptions);

    } else {
      this._initializeWithDefaults();
    }
  }

  // Computed

  public readonly theme = computed<IFmModalTheme>(() => {
    return this._themes()[this._themeName()];
  });

  public readonly themeName = computed<string>(() => {
    return this._themeName();
  });

  public readonly themeClass = computed<string>(() => {
    return this.getThemeClass(this.themeName());
  });

  public readonly themes = computed<IFmModalThemes>(() => {
    return this._themes();
  });

  public readonly widthPresets = computed<Record<TFmWidthPreset, number>>(() => {
    return this._widthPresets();
  });


  // Public methods

  public registerTheme(themeOptions: IFmModalThemeOptions): void {
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
    return !!themeName && (themeName in this._themes());
  }

  public getTheme(themeName: string): IFmModalTheme | undefined {
    return this._themes()[themeName];
  }

  public setTheme(themeName: string): void {
    if (!this.isThemeExist(themeName)) {
      throw new Error(`Unable to switch theme. Theme with '${themeName}' is not registered`);
    }

    this._themeName.set(themeName);
  }

  public getThemeClass(themeName: string): string {
    return `fm-modal-theme--${themeName}-${this._instanceId}`;
  }

  public attachThemeStyles(): void {
    if (this._styleElement) {
      this.detachThemeStyles();
    }

    this._styleElement = appendHeaderStyleElement([
      ...this._generateWidthPresetsStyles(),
      ...this._generateThemeStyles(),
    ]);
  }

  public detachThemeStyles(): void {
    if (!this._styleElement) {
      return;
    }

    this._styleElement.remove();
    this._styleElement = null;
  }


  // Private methods

  private _initializeWidthPresets(widthPresets: Record<TFmWidthPreset, number>): void {
    this._widthPresets.set(widthPresets);
  }

  private _initializeWithDefaults(): void {
    this._themeName.set(FM_DEFAULT_THEME);
    this._themes.set({
      [FM_DEFAULT_THEME]: {
        colors: fmDefaultColorScheme,
        styling: fmDefaultStyling,
      }
    });
  }

  private _initializeWithOptions(
    colorsScheme: IFmModalColorScheme | null,
    stylingOptions: IFmModalStylingOptions | null,
  ): void {

    this._themeName.set(FM_DEFAULT_THEME);
    this._themes.set({ [FM_DEFAULT_THEME]: this._composeThemeConfig(colorsScheme, stylingOptions) });
  }

  private _initializeWithThemes(themeConfigs: Array<IFmModalThemeOptions>): void {
    const themes: IFmModalThemes = {};
    let themeDefault = '';

    themeConfigs.forEach((themeConfig: IFmModalThemeOptions) => {
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

  private _validateThemeConfig(themeConfig: IFmModalThemeOptions): boolean {
    if (!themeConfig.name) {
      console.warn(`"${themeConfig.name}" is not a valid theme name. This theme was skipped.`);

      return false;
    }

    return true;
  }

  private _generateWidthPresetsStyles(): Array<string> {
    const presets = this._widthPresets();
    const props: Array<string> = [];

    for (const presetName in presets) {
      if (Object.prototype.hasOwnProperty.call(presets, presetName)) {
        props.push(`--fm-modal-preset-width-${presetName}: ${presets[<TFmWidthPreset>presetName]}px;`);
      }
    }

    return [
      'fm-modals-outlet {'
      + props
        .map(propStr => `  ${propStr}\n`)
        .join('')
      + '}\n'
    ];
  }

  private _generateThemeStyles(): Array<string> {
    const themes = this._themes();
    const classDefinitions: Array<string> = [];

    for (const themeName in themes) {
      if (!Object.prototype.hasOwnProperty.call(themes, themeName)) {
        continue;
      }

      const theme = themes[themeName];
      const themeClassName = this.getThemeClass(themeName);
      const themeClassProps = [
        ...this._generateThemeClassProperties(theme.colors, fmColorSchemeCssVars),
        ...this._generateThemeClassProperties(theme.styling, fmStylingCssVars, fmStylingCssValueGetters),
      ];

      classDefinitions.push((
        `.${themeClassName} {\n`
        + themeClassProps
          .map(propStr => `  ${propStr}\n`)
          .join('')
        + '}\n'
      ));
    }

    return classDefinitions;
  }

  private _generateThemeClassProperties<SchemeT extends Record<string, any>>(
    scheme: SchemeT,
    schemeMap: Record<keyof SchemeT, string>,
    schemeValuesMap?: Record<keyof SchemeT, ((value: any) => string) | undefined>,
  ): Array<string> {

    const properties: Array<string> = [];

    for (const schemePropNameRaw in scheme) {
      const schemePropName = <keyof SchemeT>schemePropNameRaw;

      if (
        !schemeMap[schemePropName]
        || scheme[schemePropName] === false
        || scheme[schemePropName] === null
        || scheme[schemePropName] === undefined
        || !Object.prototype.hasOwnProperty.call(scheme, schemePropName)
      ) {
        continue;
      }

      const propName = schemeMap[schemePropName];
      const propValue = schemeValuesMap?.[schemePropName]
        ? schemeValuesMap[schemePropName](scheme[schemePropName])
        : scheme[schemePropName];

      properties.push(`${propName}: ${propValue};`);
    }

    return properties;
  }

  private _composeThemeConfig(
    colorsScheme: Partial<IFmModalColorScheme> | null | undefined,
    stylingOptions: IFmModalStylingOptions | null | undefined
  ): IFmModalTheme {

    return {
      colors: {
        ...fmDefaultColorScheme,
        ...(colorsScheme || {}),
      },
      styling: {
        ...fmDefaultStyling,
        ...(stylingOptions
          ? normalizeOptions(stylingOptions, ['headerActionsPosition', 'frameShadow'])
          : {}
        ),
      },
    };
  }
}
