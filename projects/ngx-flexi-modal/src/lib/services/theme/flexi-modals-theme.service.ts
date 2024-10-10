import { computed, Inject, Injectable, Optional, signal } from '@angular/core';

import { FLEXI_MODAL_COLOR_SCHEME, FLEXI_MODAL_STYLING_OPTIONS, FLEXI_MODAL_THEME } from '../../flexi-modals.tokens';
import { generateRandomId, normalizeOptions } from '../../tools/utils';
import {
  FM_DEFAULT_THEME,
  fmColorSchemeCssVars,
  fmDefaultColorScheme,
  fmDefaultStyling,
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

  private readonly _themes = signal<IFmModalThemes>({});

  private readonly _themeName = signal<string>('');

  private readonly _instanceId = generateRandomId();

  private _stylesElement: HTMLStyleElement | null = null;

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

  constructor(
    @Optional() @Inject(FLEXI_MODAL_THEME) themeConfigs: Array<IFmModalThemeOptions>,
    @Optional() @Inject(FLEXI_MODAL_COLOR_SCHEME) defaultColorScheme: IFmModalColorScheme,
    @Optional() @Inject(FLEXI_MODAL_STYLING_OPTIONS) defaultStylingOptions: IFmModalStylingOptions,
  ) {
    if (themeConfigs?.length && (defaultColorScheme || defaultStylingOptions)) {
      console.warn(
        'Specified both providers "FM_MODAL_COLOR_SCHEME" or "FM_MODAL_STYLING_OPTIONS" ' +
        'and "FM_MODAL_THEME". The "FM_MODAL_COLOR_SCHEME" provider was ignored.'
      );
    }

    if (themeConfigs?.length) {
      this._initializeWithThemes(themeConfigs);

    } else if (defaultColorScheme || defaultStylingOptions) {
      this._initializeWithOptions(defaultColorScheme, defaultStylingOptions);

    } else {
      this._initializeWithDefaults();
    }
  }


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
    return themeName in this._themes();
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
    const classDefinitions = this._generateThemeStyles();

    this._stylesElement = document.createElement('style');
    this._stylesElement.type = 'text/css';
    this._stylesElement.innerHTML = classDefinitions.join('\n');

    document.getElementsByTagName('head')[0].appendChild(this._stylesElement);
  }

  public detachThemeStyles(): void {
    if (!this._stylesElement) {
      return;
    }

    this._stylesElement.remove();
    this._stylesElement = null;
  }


  // Private methods

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
    colorsScheme: IFmModalColorScheme,
    stylingOptions: IFmModalStylingOptions,
  ): void {

    this._themeName.set(FM_DEFAULT_THEME);
    this._themes.set({
      [FM_DEFAULT_THEME]: this._composeThemeConfig(colorsScheme, stylingOptions),
    });
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
    if (!themeConfig.name || typeof themeConfig.name !== 'string') {
      console.warn(`"${themeConfig.name}" is not a valid theme name. This theme was skipped.`);

      return false;
    }

    return true;
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
        + '}'
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
    colorsScheme: Partial<IFmModalColorScheme> | undefined,
    stylingOptions: IFmModalStylingOptions | undefined
  ): IFmModalTheme {

    return {
      colors: {
        ...fmDefaultColorScheme,
        ...(colorsScheme || {}),
      },
      styling: {
        ...fmDefaultStyling,
        ...(stylingOptions
          ? normalizeOptions(stylingOptions, ['headerActions', 'frameShadow'])
          : {}
        ),
      },
    };
  }
}
