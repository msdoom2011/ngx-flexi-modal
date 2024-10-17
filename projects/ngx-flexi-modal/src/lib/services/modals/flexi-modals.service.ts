import {
  ComponentRef,
  computed,
  EmbeddedViewRef,
  inject,
  Injectable,
  signal,
  TemplateRef,
  Type
} from '@angular/core';
import {BehaviorSubject, filter, Observable, Subject} from 'rxjs';

import {FLEXI_MODAL_DEFAULT_OPTIONS, FLEXI_MODAL_EXTENSION} from '../../flexi-modals.tokens';
import {FmModalBeforeCloseEvent} from './events/fm-modal-before-close.event';
import {FlexiModalsThemeService} from '../theme/flexi-modals-theme.service';
import {FmModalBeforeOpenEvent} from './events/fm-modal-before-open.event';
import {FmModalWithComponent} from '../../models/fm-modal-with-component';
import {FmModalWithTemplate} from '../../models/fm-modal-with-template';
import {isPlainObject, normalizeOptions} from '../../tools/utils';
import {FmModalUpdateEvent} from './events/fm-modal-update.event';
import {FmModalCloseEvent} from './events/fm-modal-close.event';
import {fmModalOptionsDefault} from './flexi-modals.constants';
import {FmModalOpenEvent} from './events/fm-modal-open.event';
import {FmModal} from '../../models/fm-modal';
import {
  IFmModalWithComponentOptions,
  IFmExtension,
  IFmExtensionOptionsByModalTypes,
  IFmExtensionModalTypeConfig,
  IFmModalOptions,
  IFmModalWithTemplateOptions,
  TFmModalEvent
} from './flexi-modals.definitions';

@Injectable({
  providedIn: 'root'
})
export class FlexiModalsService<
  ExtensionOptionsByTypesT extends IFmExtensionOptionsByModalTypes = IFmExtensionOptionsByModalTypes
> {

  private readonly _themes = inject(FlexiModalsThemeService);

  private readonly _extensionsArr = inject<Array<IFmExtension<ExtensionOptionsByTypesT>>>(FLEXI_MODAL_EXTENSION);

  private readonly _defaultOptions = inject<IFmModalOptions | undefined>(FLEXI_MODAL_DEFAULT_OPTIONS, { optional: true });

  private readonly _extensions = <Record<keyof ExtensionOptionsByTypesT, IFmExtensionModalTypeConfig>>{};

  private readonly _events$ = new Subject<TFmModalEvent>();

  private readonly _modals = signal<Array<FmModal>>([]);

  public modals = computed<Array<FmModal>>(() => {
    return this._modals();
  });

  public get events$(): Observable<TFmModalEvent>{
    return this._events$.pipe(filter($event => !$event.stopped));
  }

  constructor() {
    this._extensions = <Record<keyof ExtensionOptionsByTypesT, IFmExtensionModalTypeConfig>>(
      this._extensionsArr.reduce((result, extension) => ({...result, ...extension}), {})
    );

    if (this._defaultOptions && !isPlainObject(this._defaultOptions)) {
      throw new Error(
        'Provided invalid default options object using injection token ' +
        '"FLEXI_MODAL_DEFAULT_OPTIONS" for the ngx-flexi-modal library. ' +
        'It should be a plain object.'
      );
    }
  }

  public registerExtension(extension: IFmExtension<any>): void {
    Object.assign(this._extensions, extension);
  }

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
  ): FmModalWithComponent<ComponentT> | null;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    openUntil$: Observable<any>
  ): FmModalWithComponent<ComponentT> | null;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    options: IFmModalWithComponentOptions<ComponentT>
  ): FmModalWithComponent<ComponentT> | null;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    openUntilOrOptions?: Observable<any> | IFmModalWithComponentOptions<ComponentT>
  ): FmModalWithComponent<ComponentT> | null {

    const content$ = new BehaviorSubject<ComponentRef<ComponentT> | null>(null);
    const modal = new FmModalWithComponent(
      this, this._themes, component, content$,
      this._normalizeOptions(openUntilOrOptions)
    );

    return this._showModal(modal);
  }

  public showTemplate<ContextT extends Record<string, unknown> = {}>(
    template: TemplateRef<ContextT>,
  ): FmModalWithTemplate<ContextT> | null;

  public showTemplate<ContextT extends Record<string, unknown> = {}>(
    template: TemplateRef<ContextT>,
    openUntil$: Observable<unknown>,
  ): FmModalWithTemplate<ContextT> | null;

  public showTemplate<ContextT extends Record<string, unknown> = {}>(
    template: TemplateRef<ContextT>,
    options: IFmModalWithTemplateOptions<ContextT>,
  ): FmModalWithTemplate<ContextT> | null;

  public showTemplate<ContextT extends Record<string, unknown> = {}>(
    template: TemplateRef<ContextT>,
    openUntilOrOptions?: Observable<any> | IFmModalWithTemplateOptions<ContextT>,
  ): FmModalWithTemplate<ContextT> | null {

    const content$ = new BehaviorSubject<EmbeddedViewRef<ContextT> | null>(null);
    const modal = new FmModalWithTemplate(
      this, this._themes, template, content$,
      this._normalizeOptions(openUntilOrOptions)
    );

    return this._showModal(modal);
  }

  public show<
    ComponentT extends object,
    T extends keyof ExtensionOptionsByTypesT
  >(
    modalType: T,
    options: ExtensionOptionsByTypesT[T]
  ): FmModalWithComponent<ComponentT> | null {

    const modalTypeConfig = this._extensions[modalType];

    if (!modalTypeConfig) {
      throw new Error(`Trying to instantiate modal of unregistered type "${String(modalType)}"`);
    }

    return this.showComponent(
      modalTypeConfig.component,
      modalTypeConfig.convert(options),
    );
  }

  public updateModal(modalId: string, changes: IFmModalOptions<any>): void {
    const modal = this.getModalById(modalId);

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
  }

  public closeModal(modalId: string): void {
    const modal = this.getModalById(modalId);

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
      this.closeModal(modalConfig.id());
    });
  }

  public getModalActive<ModalT extends FmModal = FmModal>(): ModalT | undefined {
    const modals = this._modals();

    if (!modals.length) {
      return;
    }

    return <ModalT>modals[modals.length - 1];
  }

  public getModalById<ModalT extends FmModal = FmModal>(modalId: string): ModalT | undefined {
    if (!modalId) {
      return;
    }

    return <ModalT | undefined>this._modals().find(modal => modal.id() === modalId);
  }


  // Private implementation

  private _normalizeOptions<ModalOptionsT extends Partial<IFmModalOptions<any>>>(
    openUntilOrOptions: ModalOptionsT | Observable<unknown> | undefined
  ): ModalOptionsT {
    return <ModalOptionsT>{
      ...fmModalOptionsDefault,
      ...(this._defaultOptions || {}),
      ...(isPlainObject(openUntilOrOptions)
        ? (normalizeOptions(<ModalOptionsT>openUntilOrOptions) || {})
        : { openUntil: openUntilOrOptions }
      )
    };
  }

  private _showModal<ModalT extends FmModal>(modal: ModalT): ModalT | null {
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
}
