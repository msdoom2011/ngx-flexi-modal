import { computed, inject, Injectable, signal } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';

import { IFmModalOptions, IFmShowModalFn, TFmModalEvent } from './flexi-modals.definitions';
import { FmModalBeforeCloseEvent } from './events/fm-modal-before-close.event';
import { FmModalBeforeOpenEvent } from './events/fm-modal-before-open.event';
import { FmModalUpdateEvent } from './events/fm-modal-update.event';
import { FmModalCloseEvent } from './events/fm-modal-close.event';
import { FmModalOpenEvent } from './events/fm-modal-open.event';
import { FLEXI_MODAL_FACTORY } from '../../flexi-modals.tokens';
import { FmModalFactory } from './factories/fm-modal.factory';
import { isPlainObject } from '../../tools/utils';
import { FmModal } from '../../models/fm-modal';
import { FmModalMinimizeEvent } from './events/fm-modal-minimize.event';
import { FmModalMaximizeEvent } from './events/fm-modal-maximize.event';

@Injectable({
  providedIn: 'root'
})
export class FlexiModalsService {

  private readonly _factories = inject<Array<FmModalFactory<any>>>(FLEXI_MODAL_FACTORY);

  private readonly _events$ = new Subject<TFmModalEvent>();

  private readonly _modals = signal<Array<FmModal>>([]);

  public readonly modals = computed<Array<FmModal>>(() => {
    return this._modals();
  });

  public get events$(): Observable<TFmModalEvent>{
    return this._events$.pipe(filter($event => !$event.stopped));
  }

  public getFactories(): Array<FmModalFactory<any>> {
    return this._factories;
  }

  public findFactory(subject: unknown): FmModalFactory<any> | undefined {
    return this._factories.find(factory => factory.test(subject));
  }

  public show: IFmShowModalFn = (
    subject: unknown,
    openUntilOrOptions?: Observable<unknown> | object
  ): FmModal<any, any> | null => {

    const factory = this.findFactory(subject);

    if (!factory) {
      throw new Error(`Unable to find a proper modal factory for the subject: ${subject}`);
    }

    const modalOptions = isPlainObject(openUntilOrOptions)
      ? openUntilOrOptions
      : openUntilOrOptions
        ? { openUntil: openUntilOrOptions }
        : {};
    const modal = factory.create(subject, modalOptions);
    const $beforeOpenEvent = new FmModalBeforeOpenEvent(modal);

    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return null;
    }

    this._modals.set([ ...this._modals(), modal ]);

    modal.content$
      .pipe(filter(Boolean))
      .subscribe(() => {
        const $openEvent = new FmModalOpenEvent(modal);

        this._events$.next($openEvent);

        if (!$openEvent.stopped) {
          modal.config().onOpen?.($openEvent);
        }
      });

    return modal;
  }

  public update(modalId: string, changes: IFmModalOptions<any>): void {
    const modal = this.getById(modalId);

    if (!modal) {
      return;
    }

    this._modals.update(modals => {
      modals[modal.index()].setOptions(changes);

      return [ ...modals ];
    });

    this._events$.next(new FmModalUpdateEvent(
      modal,
      changes,
    ));

    if ('maximized' in changes) {
      const $maximizeEvent = changes.maximized
        ? new FmModalMaximizeEvent(modal)
        : new FmModalMinimizeEvent(modal);

      this._events$.next($maximizeEvent);

      changes.maximized
        ? modal.config().onMaximize?.(<FmModalMaximizeEvent>$maximizeEvent)
        : modal.config().onMinimize?.(<FmModalMinimizeEvent>$maximizeEvent);
    }
  }

  public close(modalId: string): void {
    const modal = this.getById(modalId);

    if (!modal) {
      return;
    }

    const $beforeCloseEvent = new FmModalBeforeCloseEvent(modal);

    this._events$.next($beforeCloseEvent);

    if (!$beforeCloseEvent.stopped) {
      modal.config().onClose?.($beforeCloseEvent);
    }

    if ($beforeCloseEvent.prevented || $beforeCloseEvent.stopped) {
      return;
    }

    this._modals.update(modals => modals.filter(modalInst => modalInst.id() !== modalId));
    this._events$.next(new FmModalCloseEvent(modal));
  }

  public closeAll(): void {
    [...this._modals()].forEach(modalConfig => {
      this.close(modalConfig.id());
    });
  }

  public getById<ModalT extends FmModal = FmModal>(modalId: string): ModalT | undefined {
    if (!modalId) {
      return;
    }

    return <ModalT | undefined>this._modals().find(modal => modal.id() === modalId);
  }

  public getActive<ModalT extends FmModal = FmModal>(): ModalT | undefined {
    const modals = this._modals();

    if (!modals.length) {
      return;
    }

    return <ModalT>modals[modals.length - 1];
  }
}
