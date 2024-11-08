import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { FmModalWithTemplate } from '../../../models/fm-modal-with-template';
import { IFmModalWithTemplateOptions } from '../flexi-modals.definitions';
import { isPlainObject } from '../../../tools/utils';
import { FmModalFactory } from './fm-modal.factory';

@Injectable()
export class FmModalWithTemplateFactory extends FmModalFactory<FmModalWithTemplate> {

  public test(subject: unknown): boolean {
    return !!(subject && subject instanceof TemplateRef);
  }

  public create<ContextT extends object>(
    templateRef: TemplateRef<ContextT>,
    optionsOrOpenUntil: Observable<unknown> | IFmModalWithTemplateOptions<ContextT> | undefined
  ): FmModalWithTemplate<ContextT> {

    const content$ = new BehaviorSubject<EmbeddedViewRef<ContextT> | null>(null);
    const options = isPlainObject(optionsOrOpenUntil)
      ? optionsOrOpenUntil
      : optionsOrOpenUntil
        ? { openUntil: optionsOrOpenUntil }
        : {};

    return new FmModalWithTemplate(
      this.service,
      this.themes,
      templateRef,
      content$,
      this._normalizeOptions(options),
    );
  }
}
