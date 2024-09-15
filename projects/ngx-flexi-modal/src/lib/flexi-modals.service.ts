import {inject, Injectable, Signal, signal, TemplateRef, Type} from "@angular/core";
import {BehaviorSubject, filter, Observable, of, Subject, take, tap} from "rxjs";

import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FLEXI_MODAL_EXTENSION} from "./flexi-modals.tokens";
import {generateRandomId} from "./tools/utils";
import {
  flexiModalButtonOptionsDefault,
  flexiModalOptionsDefault,
  FlexiModalEventType,
  FlexiModalType
} from "./flexi-modals.constants";
import {
  IFlexiComponentModalConfig,
  IFlexiComponentModalCreateOptions,
  IFlexiModalConfig,
  IFlexiModalCreateOptions,
  IFlexiModalExtension,
  IFlexiModalExtensionOptionsByTypes,
  IFlexiModalExtensionTypeConfig,
  IFlexiTemplateModalConfig,
  IFlexiTemplateModalCreateOptions
} from "./flexi-modals.models";
import {
  FlexiComponentModalContainerComponent
} from "./components/modals-outlet/modal-container/container-types/component/flexi-component-modal-container.component";
import {
  FlexiTemplateModalContainerComponent
} from "./components/modals-outlet/modal-container/container-types/template/flexi-template-modal-container.component";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";

@Injectable()
export class FlexiModalsService<
  ExtensionOptionsByTypesT extends IFlexiModalExtensionOptionsByTypes = IFlexiModalExtensionOptionsByTypes
> {

  private readonly _extensionsArr = inject<Array<IFlexiModalExtension<ExtensionOptionsByTypesT>>>(FLEXI_MODAL_EXTENSION);

  private readonly _extensions: Record<keyof ExtensionOptionsByTypesT, IFlexiModalExtensionTypeConfig> = <any>{};

  private readonly _events$ = new Subject<
    FlexiModalBeforeOpenEvent
    | FlexiModalOpenEvent
    | FlexiModalBeforeCloseEvent
    | FlexiModalCloseEvent
    | FlexiModalUpdateEvent
  >();

  private readonly _modals = signal<Array<IFlexiModalConfig<any>>>([]);

  public get modals(): Signal<Array<IFlexiModalConfig<any>>> {
    return this._modals.asReadonly();
  }

  public get events$(): Observable<
    FlexiModalBeforeOpenEvent
    | FlexiModalOpenEvent
    | FlexiModalBeforeCloseEvent
    | FlexiModalCloseEvent
    | FlexiModalUpdateEvent
  >{
    return this._events$.pipe(filter($event => !$event.stopped));
  }

  constructor() {
    this._extensions = this._extensionsArr.reduce(
      (result, extension) => ({...result, ...extension}),
      {}
    ) as Record<keyof ExtensionOptionsByTypesT, IFlexiModalExtensionTypeConfig>;
  }

  public registerExtension(extension: IFlexiModalExtension<any>): void {
    Object.assign(this._extensions, extension);
  }

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntil$: Observable<any>
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    options: IFlexiComponentModalCreateOptions<ComponentT>
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntilOrOptions?: Observable<any> | IFlexiComponentModalCreateOptions<ComponentT>
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null> {

    const modal$ = new BehaviorSubject<FlexiComponentModalContainerComponent<ComponentT> | null>(null);
    const modalConfig: IFlexiComponentModalConfig<ComponentT> = {
      ...this._normalizeModalOptions(takeUntilOrOptions),
      type: FlexiModalType.Component,
      component,
      modal$,
    };
    const $beforeOpenEvent = new FlexiModalBeforeOpenEvent(modalConfig);

    this._modals.set([ ...this._modals(), modalConfig ]);
    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return of(null);
    }

    return modal$
      .pipe(
        filter(modalContainerComponent => !!modalContainerComponent),
        tap((modalContainerComponent: FlexiComponentModalContainerComponent<ComponentT>) => {
          const $openEvent = new FlexiModalOpenEvent(modalConfig, modalContainerComponent);

          this._events$.next($openEvent);

          if (!$openEvent.stopped) {
            modalConfig.onOpen?.($openEvent);
          }
        })
      );
  }

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
  ): Observable<FlexiTemplateModalContainerComponent<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntil$: Observable<unknown>,
  ): Observable<FlexiTemplateModalContainerComponent<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    options: IFlexiTemplateModalCreateOptions<ContextT>,
  ): Observable<FlexiTemplateModalContainerComponent<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntilOrOptions?: Observable<any> | IFlexiTemplateModalCreateOptions<ContextT>,
  ): Observable<FlexiTemplateModalContainerComponent<ContextT> | null> {

    const modal$ = new BehaviorSubject<FlexiTemplateModalContainerComponent<ContextT> | null>(null);
    const modalConfig: IFlexiTemplateModalConfig<ContextT> = {
      ...this._normalizeModalOptions(takeUntilOrOptions),
      type: FlexiModalType.Template,
      template,
      modal$,
    };
    const $beforeOpenEvent = new FlexiModalBeforeOpenEvent(modalConfig);

    this._modals.set([ ...this._modals(), modalConfig ]);
    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return of(null);
    }

    return modal$
      .pipe(
        filter(modalContainerComponent => !!modalContainerComponent),
        tap((modalContainerComponent: FlexiTemplateModalContainerComponent<ContextT>) => {
          const $openEvent = new FlexiModalOpenEvent(modalConfig, modalContainerComponent);

          this._events$.next($openEvent);

          if (!$openEvent.stopped) {
            modalConfig.onOpen?.($openEvent);
          }
        })
      );
  }

  public show<
    ComponentT extends object,
    T extends keyof ExtensionOptionsByTypesT
  >(
    modalType: T,
    options: ExtensionOptionsByTypesT[T]
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null> {

    const modalTypeConfig = this._extensions[modalType];

    if (!modalTypeConfig) {
      throw new Error(`Trying to instantiate modal of unregistered type "${String(modalType)}"`);
    }

    return this.showComponent(
      modalTypeConfig.component,
      modalTypeConfig.convert(options),
    );
  }

  public updateModal(modalId: string, changes: Partial<IFlexiModalCreateOptions<any>>): void {
    const modalIndex = this.getModalIndexById(modalId);

    if (modalIndex < 0) {
      return;
    }

    this._modals.update((modalConfigs) => {
      modalConfigs[modalIndex] = this._normalizeModalOptions({
        ...modalConfigs[modalIndex],
        ...changes
      });

      return [ ...modalConfigs ];
    });

    const modalConfig = this.getModalConfigById(modalId);

    if (!modalConfig) {
      return;
    }

    this._events$.next(new FlexiModalUpdateEvent(
      modalConfig,
      modalConfig.modal$.getValue(),
      changes,
    ));
  }

  public closeModal(modalId: string): void {
    const modalConfig = this.getModalConfigById(modalId);

    if (!modalConfig) {
      return;
    }

    const $beforeCloseEvent = new FlexiModalBeforeCloseEvent(
      modalConfig,
      modalConfig.modal$.getValue(),
    );

    this._events$.next($beforeCloseEvent);

    if (!$beforeCloseEvent.stopped) {
      modalConfig.onClose?.($beforeCloseEvent);
    }

    if ($beforeCloseEvent.prevented || $beforeCloseEvent.stopped) {
      return;
    }

    this._modals.update(modals => modals.filter(modalConfig => modalConfig.id !== modalId));

    setTimeout(() => {
      this._events$.next(new FlexiModalCloseEvent(
        modalConfig,
        modalConfig.modal$.getValue(),
      ));
    });
  }

  public closeAll(): void {
    [...this._modals()].forEach(modalConfig => {
      this.closeModal(<string>modalConfig.id);
    });
  }

  public getActiveModalId(): string | undefined {
    const modals = this._modals();

    if (!modals.length) {
      return;
    }

    return modals[modals.length - 1]?.id;
  }

  public getModalIndexById(modalId: string): number {
    if (!modalId) {
      return -1;
    }

    return this._modals().findIndex(modalConfig => modalConfig.id === modalId);
  }

  public getModalConfigById<
    ModalConfigT extends IFlexiModalConfig<any> = IFlexiModalConfig<any>
  >(modalId: string): ModalConfigT | undefined {
    if (!modalId) {
      return;
    }

    return <ModalConfigT | undefined>this._modals().find(modalConfig => modalConfig.id === modalId);
  }


  // Private implementation

  private _generateModalId(): string {
    return `flexi-modal-${generateRandomId()}`;
  }

  private _normalizeModalOptions<ModalOptionsT extends IFlexiModalCreateOptions<any>>(
    takeUntilOrOptions: ModalOptionsT | Observable<unknown> | undefined
  ): ModalOptionsT {
    const options = <ModalOptionsT>{
      ...flexiModalOptionsDefault,
      ...(
        takeUntilOrOptions instanceof Observable
          ? { aliveUntil: takeUntilOrOptions }
          : (takeUntilOrOptions || {})
      )
    };

    if (!options.id) {
      options.id = this._generateModalId();
    }

    if (options.buttons && options.buttons.length > 0) {
      for (let i = 0; i < options.buttons.length; i++) {
        options.buttons[i] = {
          id: `fm-modal-button-${generateRandomId()}`,
          ...flexiModalButtonOptionsDefault,
          ...options.buttons[i]
        }
      }
    }

    return options;
  }
}
