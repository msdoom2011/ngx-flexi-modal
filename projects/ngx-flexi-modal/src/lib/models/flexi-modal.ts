import {BehaviorSubject} from "rxjs";

import {flexiModalActionOptionsDefault, flexiModalOptionsDefault} from "../services/modals/flexi-modals.constants";
import {IFlexiModalConfig, IFlexiModalOptions} from "../services/modals/flexi-modals.definitions";
import {FlexiModalsService} from "../services/modals/flexi-modals.service";
import {FlexiModalActions} from "./actions/flexi-modal-actions";
import {generateRandomId} from "../tools/utils";
import {Signal, signal} from "@angular/core";

export abstract class FlexiModal<
  ConfigT extends IFlexiModalConfig<any> = IFlexiModalConfig<any>,
  OptionsT extends IFlexiModalOptions<any> = IFlexiModalOptions<any>,
  ContentRenderedT = any,
  ContentToRenderT = any
> {

  public abstract readonly type: string;

  private _config = signal<ConfigT>(<ConfigT>{});

  public actions!: FlexiModalActions<this>;

  constructor(
    public service: FlexiModalsService,

    // The content that appears inside the modal
    public content: ContentToRenderT,

    // The already rendered content inside the modal
    public content$: BehaviorSubject<ContentRenderedT | null>,

    // Modal configuration options
    options: OptionsT,
  ) {
    this.actions = new FlexiModalActions(this.service, this);
    this.setOptions(options);
  }

  public get id(): string {
    return this._config().id || '';
  }

  public get index(): number {
    return this.service.modals().findIndex(modalConfig => modalConfig.id === this.id);
  }

  public get config(): Signal<ConfigT> {
    return this._config.asReadonly();
  }

  public get active(): boolean {
    return this.service.modals()[this.service.modals().length - 1]?.id === this.id;
  }

  public get stretched(): boolean {
    return this._config().stretch;
  }


  // Public methods

  public setOptions(options: OptionsT): void {
    this._config.set(this._normalizeOptions(options));
  }

  public update(options?: OptionsT): void {
    this.service.updateModal(this.id, options || this._config());
  }

  public stretch(): void {
    if (!this._config().stretch) {
      this.update(<OptionsT>{stretch: true});
    }
  }

  public compress(): void {
    if (this._config().stretch) {
      this.update(<OptionsT>{stretch: false});
    }
  }

  public close(): void {
    this.service.closeModal(this.id);
  }


  // Internal implementation

  private _generateModalId(): string {
    return `flexi-modal-${generateRandomId()}`;
  }

  protected _normalizeOptions(options: OptionsT): ConfigT {
    const config = <ConfigT>{
      ...(!Object.keys(this._config()).length
        ? <ConfigT>flexiModalOptionsDefault
        : this._config()
      ),
      ...options
    };

    if (!config.id) {
      config.id = this._generateModalId();
    }

    if (config.actions && config.actions.length > 0) {
      for (let i = 0; i < config.actions.length; i++) {
        config.actions[i] = {
          ...flexiModalActionOptionsDefault,
          ...{ id: `fm-modal-action-${generateRandomId()}` },
          ...config.actions[i]
        }
      }
    }

    return config;
  }
}
