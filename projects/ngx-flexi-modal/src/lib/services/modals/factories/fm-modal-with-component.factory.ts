import { ComponentRef, Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FmModalWithComponent } from '../../../models/fm-modal-with-component';
import { IFmModalWithComponentOptions } from '../flexi-modals.definitions';
import { FmModalFactory } from './fm-modal.factory';

@Injectable()
export class FmModalWithComponentFactory extends FmModalFactory<FmModalWithComponent> {

  public test(subject: unknown): boolean {
    return !!(subject && typeof subject === 'function');
  }

  public create<ComponentT = unknown>(
    component: Type<ComponentT>,
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