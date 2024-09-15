import {inject, Injectable, Signal, signal, TemplateRef, Type} from "@angular/core";
import {BehaviorSubject, filter, Observable, of, Subject, tap} from "rxjs";

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
import {
  FlexiComponentModalContainerComponent
} from "./components/modals-outlet/modal-container/container-types/component/flexi-component-modal-container.component";
import {
  FlexiTemplateModalContainerComponent
} from "./components/modals-outlet/modal-container/container-types/template/flexi-template-modal-container.component";

@Injectable()
export class FlexiModalsService<
  ExtensionOptionsByTypesT extends IFlexiModalExtensionOptionsByTypes = IFlexiModalExtensionOptionsByTypes
> {

  private readonly _extensionsArr = inject<Array<IFlexiModalExtension<ExtensionOptionsByTypesT>>>(FLEXI_MODAL_EXTENSION);

  private readonly _extensions: Record<keyof ExtensionOptionsByTypesT, IFlexiModalExtensionTypeConfig> = <any>{};

  private readonly _events$ = new Subject<TFlexiModalEvent>();

  // private readonly _modals = signal<Array<IFlexiModalConfig<any>>>([]);
  private readonly _modals = signal<Array<FlexiModal>>([]);

  // public get modals(): Signal<Array<IFlexiModalConfig<any>>> {
  public get modals(): Signal<Array<FlexiModal>> {
    return this._modals.asReadonly();
  }

  public get events$(): Observable<TFlexiModalEvent>{
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
    options: Partial<IFlexiComponentModalCreateOptions<ComponentT>>
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntilOrOptions?: Observable<any> | Partial<IFlexiComponentModalCreateOptions<ComponentT>>
  ): Observable<FlexiComponentModalContainerComponent<ComponentT> | null> {

    const container$ = new BehaviorSubject<FlexiComponentModalContainerComponent<ComponentT> | null>(null);
    const modal = new FlexiModalComponent(
      this,
      component,
      container$,
      this._normalizeModalOptions(takeUntilOrOptions),
    );
    // const modalConfig: IFlexiComponentModalConfig<ComponentT> = {
    //   ...this._normalizeModalOptions(takeUntilOrOptions),
    //   type: FlexiModalType.Component,
    //   component,
    //   modal$,
    // };
    const $beforeOpenEvent = new FlexiModalBeforeOpenEvent(modal);

    this._modals.set([ ...this._modals(), modal ]);
    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return of(null);
    }

    return container$
      .pipe(
        filter(modalContainerComponent => !!modalContainerComponent),
        // tap((modalContainerComponent: FlexiComponentModalContainerComponent<ComponentT>) => {
        tap(() => {
          // const $openEvent = new FlexiModalOpenEvent(modal, modalContainerComponent);
          const $openEvent = new FlexiModalOpenEvent(modal);

          this._events$.next($openEvent);

          if (!$openEvent.stopped) {
            modal.config.onOpen?.($openEvent);
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
    options: Partial<IFlexiTemplateModalCreateOptions<ContextT>>,
  ): Observable<FlexiTemplateModalContainerComponent<ContextT> | null>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntilOrOptions?: Observable<any> | Partial<IFlexiTemplateModalCreateOptions<ContextT>>,
  ): Observable<FlexiTemplateModalContainerComponent<ContextT> | null> {

    const container$ = new BehaviorSubject<FlexiTemplateModalContainerComponent<ContextT> | null>(null);
    const modal = new FlexiModalTemplate(
      this,
      template,
      container$,
      this._normalizeModalOptions(takeUntilOrOptions),
    );
    // const modalConfig: IFlexiTemplateModalConfig<ContextT> = {
    //   ...this._normalizeModalOptions(takeUntilOrOptions),
    //   type: FlexiModalType.Template,
    //   template,
    //   modal$: container$,
    // };
    const $beforeOpenEvent = new FlexiModalBeforeOpenEvent(modal);

    this._modals.set([ ...this._modals(), modal ]);
    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return of(null);
    }

    return container$
      .pipe(
        filter(modalContainerComponent => !!modalContainerComponent),
        // tap((modalContainerComponent: FlexiTemplateModalContainerComponent<ContextT>) => {
        tap(() => {
          // const $openEvent = new FlexiModalOpenEvent(modal, modalContainerComponent);
          const $openEvent = new FlexiModalOpenEvent(modal);

          this._events$.next($openEvent);

          if (!$openEvent.stopped) {
            modal.config.onOpen?.($openEvent);
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

  public updateModal(modalId: string, changes: Partial<IFlexiModalCreateOptions>): void {
    // const modalIndex = this.getModalIndexById(modalId);
    const modalIndex = this.getModalById(modalId)?.index || -1;

    if (modalIndex < 0) {
      return;
    }

    this._modals.update(modals => {
      // modalConfigs[modalIndex] = this._normalizeModalOptions({
      //   ...modalConfigs[modalIndex],
      //   ...changes
      // });
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

    const $beforeCloseEvent = new FlexiModalBeforeCloseEvent(
      modal,
      // modalConfig.modal$.getValue(),
    );

    this._events$.next($beforeCloseEvent);

    if (!$beforeCloseEvent.stopped) {
      modal.config.onClose?.($beforeCloseEvent);
    }

    if ($beforeCloseEvent.prevented || $beforeCloseEvent.stopped) {
      return;
    }

    this._modals.update(modals => modals.filter(modalConfig => modalConfig.id !== modalId));

    setTimeout(() => {
      this._events$.next(new FlexiModalCloseEvent(
        modal,
        // modal.modal$.getValue(),
      ));
    });
  }

  public closeAll(): void {
    [...this._modals()].forEach(modalConfig => {
      this.closeModal(<string>modalConfig.id);
    });
  }

  // public getActiveModalId(): string | undefined {
  public getActiveModal(): FlexiModal | undefined {
    const modals = this._modals();

    if (!modals.length) {
      return;
    }

    // return modals[modals.length - 1]?.id;
    return modals[modals.length - 1];
  }

  // public getModalIndexById(modalId: string): number {
  //   if (!modalId) {
  //     return -1;
  //   }
  //
  //   return this._modals().findIndex(modalConfig => modalConfig.id === modalId);
  // }

  // public getModalById<
  //   ModalConfigT extends IFlexiModalConfig<any> = IFlexiModalConfig<any>
  // >(modalId: string): ModalConfigT | undefined {
  public getModalById<
    ModalT extends FlexiModal = FlexiModal
  >(modalId: string): ModalT | undefined {
    if (!modalId) {
      return;
    }

    return <ModalT | undefined>this._modals()
      .find(modalConfig => modalConfig.id === modalId);
  }


  // Private implementation

  // private _generateModalId(): string {
  //   return `flexi-modal-${generateRandomId()}`;
  // }

  private _normalizeModalOptions<ModalOptionsT extends Partial<IFlexiModalCreateOptions>>(
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

    // if (!options.id) {
    //   options.id = this._generateModalId();
    // }
    //
    // if (options.buttons && options.buttons.length > 0) {
    //   for (let i = 0; i < options.buttons.length; i++) {
    //     options.buttons[i] = {
    //       id: `fm-modal-button-${generateRandomId()}`,
    //       ...flexiModalButtonOptionsDefault,
    //       ...options.buttons[i]
    //     }
    //   }
    // }

    return options;
  }
}
