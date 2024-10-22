import {computed, signal} from '@angular/core';
import {BehaviorSubject, filter, Observable} from 'rxjs';

import {fmModalActionOptionsDefault, fmModalOptionsDefault} from '../services/modals/flexi-modals.constants';
import {IFmModalConfig, IFmModalOptions, TFmModalEvent} from '../services/modals/flexi-modals.definitions';
import {FlexiModalsThemeService} from '../services/theme/flexi-modals-theme.service';
import {IFmModalTheme} from '../services/theme/flexi-modals-theme.definitions';
import {FlexiModalsService} from '../services/modals/flexi-modals.service';
import {FmModalActions} from './actions/fm-modal-actions';
import {generateRandomId} from '../tools/utils';

interface ILoadingInfo {
  loading: boolean;
  animation: boolean;
}

export abstract class FmModal<
  ConfigT extends IFmModalConfig<any> = IFmModalConfig<any>,
  OptionsT extends IFmModalOptions<any> = IFmModalOptions<any>,
  ContentRenderedT = any,
  ContentToRenderT = any
> {

  public abstract readonly type: string;

  private readonly _config = signal<ConfigT>(<ConfigT>{});

  private readonly _loading = signal<ILoadingInfo>({ loading: false, animation: true });

  public readonly actions!: FmModalActions<this>;

  public readonly events$!: Observable<TFmModalEvent>;

  constructor(
    public service: FlexiModalsService,
    public themes: FlexiModalsThemeService,

    // The content that appears inside the modal
    public content: ContentToRenderT,

    // The already rendered content inside the modal
    public content$: BehaviorSubject<ContentRenderedT | null>,

    // Modal configuration options
    options: OptionsT,
  ) {
    this.actions = new FmModalActions(this.service, this);
    this.setOptions(options);

    this.events$ = this.service.events$
      .pipe(filter(($event) => $event.id === this.id()))
  }


  // Computed

  public readonly id = computed<string>(() => {
    return this._config().id || '';
  });

  public readonly index = computed<number>(() => {
    return this.service.modals().findIndex(modalConfig => modalConfig.id === this.id);
  });

  public readonly config = computed<ConfigT>(() => {
    return this._config();
  });

  public readonly active = computed<boolean>(() => {
    return this.service.modals()[this.service.modals().length - 1]?.id === this.id;
  });

  public readonly theme = computed<IFmModalTheme>(() => {
    return this._config().theme
      ? this.themes.getTheme(this._config().theme || '') || this.themes.theme()
      : this.themes.theme();
  });

  public readonly loading = computed<boolean>(() => {
    return this._loading().loading;
  });

  public readonly loadingInfo = computed<ILoadingInfo>(() => {
    return this._loading();
  });

  public readonly maximized = computed<boolean>(() => {
    return this._config().maximized;
  });


  // Public methods

  public setOptions(options: OptionsT): void {
    this._config.set(this._normalizeOptions(options));
  }

  public update(options?: OptionsT): void {
    this.service.updateModal(this.id(), options || this._config());
  }

  public maximize(): void {
    if (!this._config().maximized) {
      this.update(<OptionsT>{maximized: true});
    }
  }

  public minimize(): void {
    if (this._config().maximized) {
      this.update(<OptionsT>{maximized: false});
    }
  }

  public toggleMaximize(): void {
    return this.maximized() ? this.minimize() : this.maximize();
  }

  public startLoading(animation: boolean = true): void {
    this._loading.set({ loading: true, animation: animation });
  }

  public stopLoading(animation: boolean = true): void {
    this._loading.set({ loading: false, animation: animation });
  }

  public close(): void {
    this.service.closeModal(this.id());
  }


  // Internal implementation

  protected _normalizeOptions(options: OptionsT): ConfigT {
    const config = <ConfigT>{
      ...(!Object.keys(this._config()).length
        ? <ConfigT>fmModalOptionsDefault
        : this._config()
      ),
      ...options
    };

    if (!config.id) {
      config.id = FmModal.generateId();
    }

    if (config.actions && config.actions.length > 0) {
      for (let i = 0; i < config.actions.length; i++) {
        config.actions[i] = {
          ...fmModalActionOptionsDefault,
          ...{ id: `fm-modal-action-${generateRandomId()}` },
          ...config.actions[i]
        }
      }
    }

    return config;
  }


  // Static methods

  public static generateId(): string {
    return `flexi-modal-${generateRandomId()}`;
  }
}
