import { AfterViewInit, Directive, input, InputSignal, viewChild, viewChildren } from '@angular/core';

import { FmModalActionDirective } from './modal/directives/fm-modal-action.directive';
import { FmModalHeaderDirective } from './modal/directives/fm-modal-header.directive';
import { FmModalFooterDirective } from './modal/directives/fm-modal-footer.directive';
import { IFmModalOptions } from '../services/modals/flexi-modals.definitions';
import { normalizeOptions } from '../tools/utils';
import { FmModal } from '../models/fm-modal';

/**
 * Applicable only for components that will be opened via showComponent method
 * Implementing this interface provides access to the modal instance inside the rendered component.
 * The modal input is optional intentionally to ensure ability to use the same component outside the modal context.
 */
export interface IFmModalAware<ModalT extends FmModal<any, any> = FmModal<any, any>> {
  modal: InputSignal<ModalT | null | undefined>;
}

/**
 * Provides a way to define a whole modal content inside a single component by
 * inheriting from the FmModalAbstract class.
 *
 * This allows you to specify modal action buttons, set title or entire header,
 * and redefine footer if it's needed right inside you modal component template.
 */
@Directive()
export abstract class FmModalAbstract<ModalT extends FmModal<any, any> = FmModal<any, any>>
implements IFmModalAware<ModalT>, AfterViewInit {

  // Inputs
  public readonly modal = input<ModalT | null>();

  // Queries
  public readonly actionsRef = viewChildren(FmModalActionDirective);
  public readonly headerRef = viewChild(FmModalHeaderDirective);
  public readonly footerRef = viewChild(FmModalFooterDirective);


  // Lifecycle hooks

  public ngAfterViewInit(): void {
    const modal = this.modal();

    if (!modal) {
      return;
    }

    const options: IFmModalOptions = {
      actionsTpl: this.actionsRef()?.length ? [...this.actionsRef()] : undefined,
      headerTpl: this.headerRef()?.templateRef,
      footerTpl: this.footerRef()?.templateRef,
    };

    modal.update(normalizeOptions(options));
  }
}
