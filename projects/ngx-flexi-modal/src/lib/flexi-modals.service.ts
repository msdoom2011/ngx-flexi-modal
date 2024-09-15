import {ComponentRef, EmbeddedViewRef, inject, Injectable, Signal, signal, TemplateRef, Type} from "@angular/core";
import {BehaviorSubject, filter, map, Observable, of, Subject, tap} from "rxjs";

import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {FlexiModalComponent} from "./modals/flexi-modal-component";
import {flexiModalOptionsDefault} from "./flexi-modals.constants";
import {FlexiModalTemplate} from "./modals/flexi-modal-template";
import {FLEXI_MODAL_EXTENSION} from "./flexi-modals.tokens";
import {FlexiModal} from "./modals/flexi-modal";
import {
  IFlexiComponentModalCreateOptions,
  IFlexiModalCreateOptions,
  IFlexiModalExtension,
  IFlexiModalExtensionOptionsByTypes,
  IFlexiModalExtensionTypeConfig,
  IFlexiTemplateModalCreateOptions,
  TFlexiModalEvent
} from "./flexi-modals.models";

@Injectable()
export class FlexiModalsService<
  ExtensionOptionsByTypesT extends IFlexiModalExtensionOptionsByTypes = IFlexiModalExtensionOptionsByTypes
> {

  private readonly _extensionsArr = inject<Array<IFlexiModalExtension<ExtensionOptionsByTypesT>>>(FLEXI_MODAL_EXTENSION);

  private readonly _extensions: Record<keyof ExtensionOptionsByTypesT, IFlexiModalExtensionTypeConfig> = <any>{};

  private readonly _events$ = new Subject<TFlexiModalEvent>();

  private readonly _modals = signal<Array<FlexiModal>>([]);

  public get modals(): Signal<Array<FlexiModal>> {
    return this._modals.asReadonly();
  }

  public get events$(): Observable<TFlexiModalEvent>{
    return this._events$.pipe(filter($event => !$event.stopped));
  }

  constructor() {
    this._extensions = (
      this._extensionsArr.reduce((result, extension) => ({...result, ...extension}), {})
    ) as Record<keyof ExtensionOptionsByTypesT, IFlexiModalExtensionTypeConfig>;
  }

  public registerExtension(extension: IFlexiModalExtension<any>): void {
    Object.assign(this._extensions, extension);
  }

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
  ): Observable<FlexiModalComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntil$: Observable<any>
  ): Observable<FlexiModalComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    options: Partial<IFlexiComponentModalCreateOptions<ComponentT>>
  ): Observable<FlexiModalComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntilOrOptions?: Observable<any> | Partial<IFlexiComponentModalCreateOptions<ComponentT>>
  ): Observable<FlexiModalComponent<ComponentT> | null> {

    const content$ = new BehaviorSubject<ComponentRef<ComponentT> | null>(null);
    const modal = new FlexiModalComponent(this, component, content$, this._normalizeOptions(takeUntilOrOptions));

    return this._showModal(modal);
  }

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
  ): Observable<FlexiModalTemplate<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntil$: Observable<unknown>,
  ): Observable<FlexiModalTemplate<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    options: Partial<IFlexiTemplateModalCreateOptions<ContextT>>,
  ): Observable<FlexiModalTemplate<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntilOrOptions?: Observable<any> | Partial<IFlexiTemplateModalCreateOptions<ContextT>>,
  ): Observable<FlexiModalTemplate<ContextT> | null> {

    const content$ = new BehaviorSubject<EmbeddedViewRef<ContextT> | null>(null);
    const modal = new FlexiModalTemplate(this, template, content$, this._normalizeOptions(takeUntilOrOptions));

    return this._showModal(modal);
  }

  public show<
    ComponentT extends object,
    T extends keyof ExtensionOptionsByTypesT
  >(
    modalType: T,
    options: ExtensionOptionsByTypesT[T]
  ): Observable<FlexiModalComponent<ComponentT> | null> {

    const modalTypeConfig = this._extensions[modalType];

    if (!modalTypeConfig) {
      throw new Error(`Trying to instantiate modal of unregistered type "${String(modalType)}"`);
    }

    return this.showComponent(
      modalTypeConfig.component,
      modalTypeConfig.convert(options),
    );
  }

  public updateModal(modalId: string, changes: Partial<IFlexiModalCreateOptions>): void {
    const modalIndex = this.getModalById(modalId)?.index || -1;

    if (modalIndex < 0) {
      return;
    }

    this._modals.update(modals => {
      modals[modalIndex].update(changes);

      return [ ...modals ];
    });

    const modal = this.getModalById(modalId);

    if (!modal) {
      return;
    }

    this._events$.next(new FlexiModalUpdateEvent(
      modal,
      changes,
    ));
  }

  public closeModal(modalId: string): void {
    const modal = this.getModalById(modalId);

    if (!modal) {
      return;
    }

    const $beforeCloseEvent = new FlexiModalBeforeCloseEvent(modal);

    this._events$.next($beforeCloseEvent);

    if (!$beforeCloseEvent.stopped) {
      modal.config.onClose?.($beforeCloseEvent);
    }

    if ($beforeCloseEvent.prevented || $beforeCloseEvent.stopped) {
      return;
    }

    this._modals.update(modals => modals.filter(modalConfig => modalConfig.id !== modalId));

    setTimeout(() => {
      this._events$.next(new FlexiModalCloseEvent(modal));
    });
  }

  public closeAll(): void {
    [...this._modals()].forEach(modalConfig => {
      this.closeModal(<string>modalConfig.id);
    });
  }

  public getActiveModal(): FlexiModal | undefined {
    const modals = this._modals();

    if (!modals.length) {
      return;
    }

    return modals[modals.length - 1];
  }

  public getModalById<ModalT extends FlexiModal = FlexiModal>(modalId: string): ModalT | undefined {
    if (!modalId) {
      return;
    }

    return <ModalT | undefined>this._modals()
      .find(modalConfig => modalConfig.id === modalId);
  }


  // Private implementation

  private _normalizeOptions<ModalOptionsT extends Partial<IFlexiModalCreateOptions>>(
    takeUntilOrOptions: ModalOptionsT | Observable<unknown> | undefined
  ): ModalOptionsT {
    return <ModalOptionsT>{
      ...flexiModalOptionsDefault,
      ...(
        takeUntilOrOptions instanceof Observable
          ? { aliveUntil: takeUntilOrOptions }
          : (takeUntilOrOptions || {})
      )
    };
  }

  private _showModal<ModalT extends FlexiModal>(modal: ModalT): Observable<ModalT | null> {
    const $beforeOpenEvent = new FlexiModalBeforeOpenEvent(modal);

    this._modals.set([ ...this._modals(), modal ]);
    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return of(null);
    }

    return modal.content$
      .pipe(
        filter(Boolean),
        map(() => modal),
        tap(() => {
          const $openEvent = new FlexiModalOpenEvent(modal);

          this._events$.next($openEvent);

          if (!$openEvent.stopped) {
            modal.config.onOpen?.($openEvent);
          }
        })
      );
  }
}
