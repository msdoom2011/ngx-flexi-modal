import { distinctUntilChanged, filter, map, Observable, Subject } from 'rxjs';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { IFmModalOptions, IFmOpenModalFn, TFmModalEvent } from './flexi-modals.definitions';
import { FmModalMaximizedChangeEvent } from './events/fm-modal-maximized-change.event';
import { FmModalBeforeCloseEvent } from './events/fm-modal-before-close.event';
import { FmModalBeforeOpenEvent } from './events/fm-modal-before-open.event';
import { FmModalActiveEvent } from './events/fm-modal-active.event';
import { FmModalUpdateEvent } from './events/fm-modal-update.event';
import { FmModalCloseEvent } from './events/fm-modal-close.event';
import { FmModalOpenEvent } from './events/fm-modal-open.event';
import { FLEXI_MODAL_FACTORY } from '../../flexi-modals.tokens';
import { FmModalFactory } from './factories/fm-modal.factory';
import { FmModal } from '../../models/fm-modal';

@Injectable({
  providedIn: 'root'
})
export class FlexiModalsService {

  private readonly _factories = inject<Array<FmModalFactory<any>>>(FLEXI_MODAL_FACTORY);

  private readonly _events$ = new Subject<TFmModalEvent>();

  private readonly _modals = signal<Array<FmModal>>([]);

  constructor() {
    toObservable(this.modalActive)
      .pipe(
        map(modal => modal?.id()),
        distinctUntilChanged(),
        filter(Boolean),
      )
      .subscribe((modalActiveId) => {
        const modalActive = this.getById(modalActiveId);

        if (modalActive) {
          this.emitEvent(new FmModalActiveEvent(modalActive, true));
        }
      });
  }

  public readonly modals = computed<Array<FmModal>>(() => {
    return this._modals();
  });

  public readonly modalActive = computed<FmModal<any, any> | undefined>(() => {
    return this._modals()[this._modals().length - 1];
  });

  public get events$(): Observable<TFmModalEvent>{
    return this._events$.pipe(filter($event => !$event.stopped));
  }

  public emitEvent($event: TFmModalEvent): void {
    this._events$.next($event);
  }

  public getFactories(): Array<FmModalFactory<any>> {
    return this._factories;
  }

  public findFactory(subject: unknown): FmModalFactory<any> | undefined {
    return this._factories.find(factory => factory.test(subject));
  }

  public open: IFmOpenModalFn = (content: unknown, options?: unknown): any | FmModal<any, any> | null => {
    const factory = this.findFactory(content);

    if (!factory) {
      throw new Error(`Unable to find a proper modal factory for the content: ${content}`);
    }

    const modal = factory.create(content, options);
    const $beforeOpenEvent = new FmModalBeforeOpenEvent(modal);

    this.emitEvent($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return null;
    }

    this._modals.set([ ...this._modals(), modal ]);

    modal.content$
      .pipe(filter(Boolean))
      .subscribe(() => {
        const $openEvent = new FmModalOpenEvent(modal);

        this.emitEvent($openEvent);

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

    this.emitEvent(new FmModalUpdateEvent(modal, changes));

    if ('maximized' in changes && typeof changes.maximized === 'boolean') {
      const $maximizeEvent = new FmModalMaximizedChangeEvent(modal, changes.maximized);

      this.emitEvent($maximizeEvent);

      changes.maximized
        ? modal.config().onMaximize?.($maximizeEvent)
        : modal.config().onMinimize?.($maximizeEvent);
    }
  }

  public close(modalId: string): void {
    const modal = this.getById(modalId);

    if (!modal) {
      return;
    }

    const $beforeCloseEvent = new FmModalBeforeCloseEvent(modal);

    this.emitEvent($beforeCloseEvent);

    if (!$beforeCloseEvent.stopped) {
      modal.config().onClose?.($beforeCloseEvent);
    }

    if ($beforeCloseEvent.prevented || $beforeCloseEvent.stopped) {
      return;
    }

    this._modals.update(modals => modals.filter(modalInst => modalInst.id() !== modalId));

    this.emitEvent(new FmModalCloseEvent(modal));
    modal.close(true);
  }

  public closeAll(): void {
    [...this._modals()].forEach(modalConfig => {
      this.close(modalConfig.id());
    });
  }

  public getById<ModalT extends FmModal = FmModal>(modalId: string): ModalT | undefined {
    return <ModalT | undefined>this._modals().find(modal => modal.id() === modalId);
  }
}
