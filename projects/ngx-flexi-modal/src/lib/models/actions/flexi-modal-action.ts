import {computed, signal} from "@angular/core";
import {Observable, tap} from "rxjs";

import {IFlexiModalActionConfig} from "../../services/modals/flexi-modals.definitions";
import {FlexiModal} from "../flexi-modal";

export class FlexiModalAction {

  private readonly _config = signal<IFlexiModalActionConfig>(<IFlexiModalActionConfig>{})

  constructor(
    public modal: FlexiModal,
    config: IFlexiModalActionConfig,
  ) {
    this._config.set(config);
  }


  // Computed props

  public readonly id = computed<string>(() => {
    return this._config().id || '';
  });

  public readonly config = computed<IFlexiModalActionConfig>(() => {
    return this._config();
  });

  public readonly index = computed<number>(() => {
    return this.modal.actions.getIndex(this.id());
  });


  // Public methods

  public enable(label?: string): void {
    this.modal.actions.update(this.id(), {
      ...(label ? { label: label } : {}),
      disabled: false,
    });
  }

  public disable(label?: string): void {
    this.modal.actions.update(this.id(), {
      ...(label ? { label: label } : {}),
      disabled: true,
    });
  }

  public update(changes: Partial<IFlexiModalActionConfig>): Observable<FlexiModalAction> {
    return this.modal.actions.update(this.id(), changes)
      .pipe(tap(action => this._config.set(action.unwrap())));
  }

  public remove(): void {
    this.modal.actions.removeById(this.id());
  }

  public replaceWith(actionConfig: IFlexiModalActionConfig): Observable<FlexiModalAction> {
    return this.modal.actions.replaceById(this.id(), actionConfig);
  }

  public unwrap(): IFlexiModalActionConfig {
    return this._config();
  }
}
