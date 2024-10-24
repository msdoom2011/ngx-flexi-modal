import {computed, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';

import {IFmModalActionConfig} from '../../services/modals/flexi-modals.definitions';
import {FmModal} from '../fm-modal';

export class FmModalAction {

  private readonly _config = signal<IFmModalActionConfig>(<IFmModalActionConfig>{})

  constructor(
    public modal: FmModal,
    config: IFmModalActionConfig,
  ) {
    this._config.set(config);
  }


  // Computed props

  public readonly id = computed<string>(() => {
    return this._config().id || '';
  });

  public readonly index = computed<number>(() => {
    return this.modal.actions.getIndex(this.id());
  });

  public readonly disabled = computed<boolean>(() => {
    return this._config().disabled;
  });

  public readonly config = computed<IFmModalActionConfig>(() => {
    return this._config();
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

  public update(changes: Partial<IFmModalActionConfig>): Observable<FmModalAction> {
    return this.modal.actions.update(this.id(), changes)
      .pipe(tap(action => this._config.set(action.unwrap())));
  }

  public remove(): void {
    this.modal.actions.removeById(this.id());
  }

  public replaceWith(actionConfig: IFmModalActionConfig): Observable<FmModalAction> {
    return this.modal.actions.replaceById(this.id(), actionConfig);
  }

  public unwrap(): IFmModalActionConfig {
    return this._config();
  }
}
