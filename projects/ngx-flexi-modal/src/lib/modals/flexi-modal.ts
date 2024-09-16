import {BehaviorSubject} from "rxjs";

import {flexiModalActionOptionsDefault, flexiModalOptionsDefault} from "../flexi-modals.constants";
import {IFlexiModalConfig, IFlexiModalOptions} from "../flexi-modals.models";
import {FlexiModalActions} from "./actions/flexi-modal-actions";
import {FlexiModalsService} from "../flexi-modals.service";
import {generateRandomId} from "../tools/utils";

export abstract class FlexiModal<
  ConfigT extends IFlexiModalConfig<any> = IFlexiModalConfig<any>,
  OptionsT extends IFlexiModalOptions<any> = IFlexiModalOptions<any>,
  ContentRenderedT = any,
  ContentToRenderT = any
> {

  public abstract readonly type: string;

  public config!: ConfigT;

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
    this._setOptions(options);
  }

  public get id(): string {
    return this.config.id || '';
  }

  public get index(): number {
    return this.service.modals().findIndex(modalConfig => modalConfig.id === this.id);
  }

  public get active(): boolean {
    return this.service.modals()[this.service.modals().length - 1]?.id === this.id;
  }


  // Public methods

  public update(options: OptionsT): void {
    this._setOptions(options);
  }

  public close(): void {
    this.service.closeModal(this.id);
  }


  // Internal implementation

  private _generateModalId(): string {
    return `flexi-modal-${generateRandomId()}`;
  }

  protected _setOptions(options: OptionsT): void {
    const config = <ConfigT>{...(this.config || flexiModalOptionsDefault), ...options};

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

    this.config = config;
  }
}
