import { ComponentRef, Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FmModalWithComponent } from '../../../models/fm-modal-with-component';
import { IFmModalWithComponentOptions } from '../flexi-modals.definitions';
import { FmModalFactory } from './fm-modal.factory';
import { IFmModalAware } from '../../../components/fm-modal.abstract';

@Injectable()
export class FmModalWithComponentFactory extends FmModalFactory<FmModalWithComponent> {

  public test(subject: unknown): boolean {
    return !!(
      subject
      && (
        typeof subject === 'function'
        || subject instanceof Promise
      )
    );
  }

  public create<ComponentT extends Partial<IFmModalAware>>(
    component: Type<ComponentT> | Promise<Type<ComponentT>>,
    options: IFmModalWithComponentOptions<ComponentT>
  ): FmModalWithComponent<ComponentT> {

    const content$ = new BehaviorSubject<ComponentRef<ComponentT> | null>(null);

    return new FmModalWithComponent(
      this.service,
      this.themes,
      component,
      content$,
      this._normalizeOptions(options)
    );
  }
}
