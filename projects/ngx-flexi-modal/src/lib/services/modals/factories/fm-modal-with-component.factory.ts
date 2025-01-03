import { ComponentRef, Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { FmModalWithComponent } from '../../../models/fm-modal-with-component';
import { IFmModalWithComponentOptions } from '../flexi-modals.definitions';
import { isPlainObject } from '../../../tools/utils';
import { FmModalFactory } from './fm-modal.factory';

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

  public create<ComponentT extends object>(
    component: Type<ComponentT> | Promise<Type<ComponentT>>,
    optionsOrOpenUntil: Observable<unknown> | IFmModalWithComponentOptions<ComponentT> | undefined
  ): FmModalWithComponent<ComponentT> {

    const content$ = new BehaviorSubject<ComponentRef<ComponentT> | null>(null);
    const options = isPlainObject(optionsOrOpenUntil)
      ? optionsOrOpenUntil
      : optionsOrOpenUntil
        ? { openUntil: optionsOrOpenUntil }
        : {};

    return new FmModalWithComponent(
      this.service,
      this.themes,
      component,
      content$,
      this._normalizeOptions(options)
    );
  }
}
