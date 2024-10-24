import { computed, Directive, inject, viewChild, ViewContainerRef } from '@angular/core';

import { FmModalInstanceComponent } from '../fm-modal-instance.component';
import { FmModal } from '../../../../models/fm-modal';

@Directive()
export abstract class FmModalInstanceContent<ModalT extends FmModal<any, any>> {

  // Dependencies
  protected readonly _instance = inject(FmModalInstanceComponent);

  // Queries
  protected readonly _contentRef = viewChild.required('content', { read: ViewContainerRef });

  // Signals
  private readonly _modal = this._instance.modal;


  // Computed

  public readonly modal = computed<ModalT>(() => {
    return <ModalT>this._modal();
  });
}
