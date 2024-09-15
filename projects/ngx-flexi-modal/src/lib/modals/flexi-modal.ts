import {BehaviorSubject} from "rxjs";

import {flexiModalButtonOptionsDefault, flexiModalOptionsDefault} from "../flexi-modals.constants";
import {IFlexiModalCreateOptions} from "../flexi-modals.models";
import {FlexiModalButtons} from "./buttons/flexi-modal-buttons";
import {FlexiModalsService} from "../flexi-modals.service";
import {generateRandomId} from "../tools/utils";

export abstract class FlexiModal<
  OptionsT extends IFlexiModalCreateOptions = IFlexiModalCreateOptions,
  ContentRenderedT = any,
  ContentToRenderT = any
> {

  public abstract readonly type: string;

  public config!: OptionsT;

  public buttons!: FlexiModalButtons<this>;

  constructor(
    public service: FlexiModalsService,

    // The content that appears inside the modal
    public content: ContentToRenderT,

    // The already rendered content inside the modal
    public content$: BehaviorSubject<ContentRenderedT | null>,

    // Modal configuration options
    options: Partial<OptionsT>,
  ) {
    this.buttons = new FlexiModalButtons(this.service, this);
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

  public update(options: Partial<OptionsT>): void {
    this._setOptions(options);
  }

  public close(): void {
    this.service.closeModal(this.id);
  }


  // Internal implementation

  private _generateModalId(): string {
    return `flexi-modal-${generateRandomId()}`;
  }

  protected _setOptions(options: Partial<OptionsT>): void {
    const config = <OptionsT>{...(this.config || flexiModalOptionsDefault), ...options};

    if (!config.id) {
      config.id = this._generateModalId();
    }

    if (config.buttons && config.buttons.length > 0) {
      for (let i = 0; i < config.buttons.length; i++) {
        config.buttons[i] = {
          id: `fm-modal-button-${generateRandomId()}`,
          ...flexiModalButtonOptionsDefault,
          ...config.buttons[i]
        }
      }
    }

    this.config = config;
  }
}
