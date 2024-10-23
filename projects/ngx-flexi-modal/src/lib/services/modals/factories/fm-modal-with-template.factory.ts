import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FmModalWithTemplate } from '../../../models/fm-modal-with-template';
import { IFmModalWithTemplateOptions } from '../flexi-modals.definitions';
import { FmModalFactory } from './fm-modal.factory';

@Injectable()
export class FmModalWithTemplateFactory extends FmModalFactory<FmModalWithTemplate> {

  public test(subject: unknown): boolean {
    return !!(subject && subject instanceof TemplateRef);
  }

  public create<ContextT extends Record<string, unknown>>(
    templateRef: TemplateRef<ContextT>,
    options: IFmModalWithTemplateOptions<ContextT>
  ): FmModalWithTemplate<ContextT> {

    const content$ = new BehaviorSubject<EmbeddedViewRef<ContextT> | null>(null);

    return new FmModalWithTemplate(
      this.service,
      this.themes,
      templateRef,
      content$,
      this._normalizeOptions(options),
    );
  }
}
