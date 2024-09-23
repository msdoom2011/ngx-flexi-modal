import {
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  NgZone,
  Signal,
  signal,
  TemplateRef,
  Type
} from "@angular/core";
import {BehaviorSubject, filter, Observable, Subject} from "rxjs";

import {FLEXI_MODAL_DEFAULT_OPTIONS, FLEXI_MODAL_EXTENSION} from "./flexi-modals.tokens";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalWithComponent} from "./modals/flexi-modal-with-component";
import {FlexiModalWithTemplate} from "./modals/flexi-modal-with-template";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {flexiModalOptionsDefault} from "./flexi-modals.constants";
import {isPlainObject, normalizeOptions} from "./tools/utils";
import {FlexiModal} from "./modals/flexi-modal";
import {
  IFlexiModalComponentOptions,
  IFlexiModalExtension,
  IFlexiModalExtensionOptionsByTypes,
  IFlexiModalExtensionTypeConfig,
  IFlexiModalOptions,
  IFlexiModalTemplateOptions,
  TFlexiModalEvent
} from "./flexi-modals.models";

@Injectable({
  providedIn: 'root'
})
export class FlexiModalsService<
  ExtensionOptionsByTypesT extends IFlexiModalExtensionOptionsByTypes = IFlexiModalExtensionOptionsByTypes
> {

  private readonly _zone = inject(NgZone);

  private readonly _extensionsArr = inject<Array<IFlexiModalExtension<ExtensionOptionsByTypesT>>>(FLEXI_MODAL_EXTENSION);

  private readonly _defaultOptions = inject<IFlexiModalOptions<any> | undefined>(FLEXI_MODAL_DEFAULT_OPTIONS, { optional: true });

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
    this._extensions = <Record<keyof ExtensionOptionsByTypesT, IFlexiModalExtensionTypeConfig>>(
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

  public registerExtension(extension: IFlexiModalExtension<any>): void {
    Object.assign(this._extensions, extension);
  }

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
  ): FlexiModalWithComponent<ComponentT> | null;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntil$: Observable<any>
  ): FlexiModalWithComponent<ComponentT> | null;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    options: IFlexiModalComponentOptions<ComponentT>
  ): FlexiModalWithComponent<ComponentT> | null;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntilOrOptions?: Observable<any> | IFlexiModalComponentOptions<ComponentT>
  ): FlexiModalWithComponent<ComponentT> | null {

    const content$ = new BehaviorSubject<ComponentRef<ComponentT> | null>(null);
    const modal = new FlexiModalWithComponent(this, component, content$, this._normalizeOptions(takeUntilOrOptions));

    return this._showModal(modal);
  }

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
  ): FlexiModalWithTemplate<ContextT> | null;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntil$: Observable<unknown>,
  ): FlexiModalWithTemplate<ContextT> | null;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    options: IFlexiModalTemplateOptions<ContextT>,
  ): FlexiModalWithTemplate<ContextT> | null;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntilOrOptions?: Observable<any> | IFlexiModalTemplateOptions<ContextT>,
  ): FlexiModalWithTemplate<ContextT> | null {

    const content$ = new BehaviorSubject<EmbeddedViewRef<ContextT> | null>(null);
    const modal = new FlexiModalWithTemplate(this, template, content$, this._normalizeOptions(takeUntilOrOptions));

    return this._showModal(modal);
  }

  public show<
    ComponentT extends object,
    T extends keyof ExtensionOptionsByTypesT
  >(
    modalType: T,
    options: ExtensionOptionsByTypesT[T]
  ): FlexiModalWithComponent<ComponentT> | null {

    const modalTypeConfig = this._extensions[modalType];

    if (!modalTypeConfig) {
      throw new Error(`Trying to instantiate modal of unregistered type "${String(modalType)}"`);
    }

    return this.showComponent(
      modalTypeConfig.component,
      modalTypeConfig.convert(options),
    );
  }

  public updateModal(modalId: string, changes: IFlexiModalOptions<any>): void {
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

    this._zone.runOutsideAngular(() => {
      setTimeout(() => {
        this._zone.run(() => {
          this._events$.next(new FlexiModalCloseEvent(modal));
        });
      });
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

  private _normalizeOptions<ModalOptionsT extends Partial<IFlexiModalOptions<any>>>(
    takeUntilOrOptions: ModalOptionsT | Observable<unknown> | undefined
  ): ModalOptionsT {
    const options = <ModalOptionsT>{
      ...flexiModalOptionsDefault,
      ...(this._defaultOptions || {}),
      ...(
        takeUntilOrOptions instanceof Observable
          ? { aliveUntil: takeUntilOrOptions }
          : (takeUntilOrOptions || {})
      )
    };

    return <ModalOptionsT>normalizeOptions(options);
  }

  private _showModal<ModalT extends FlexiModal>(modal: ModalT): ModalT | null {
    const $beforeOpenEvent = new FlexiModalBeforeOpenEvent(modal);

    this._events$.next($beforeOpenEvent);

    if ($beforeOpenEvent.prevented || $beforeOpenEvent.stopped) {
      return null;
    }

    this._modals.set([ ...this._modals(), modal ]);

    modal.content$
      .pipe(filter(Boolean))
      .subscribe(() => {
        const $openEvent = new FlexiModalOpenEvent(modal);

        this._events$.next($openEvent);

        if (!$openEvent.stopped) {
          modal.config.onOpen?.($openEvent);
        }
      });

    return modal;
  }
}
