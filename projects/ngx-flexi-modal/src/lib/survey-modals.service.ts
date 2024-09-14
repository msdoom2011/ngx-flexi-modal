import {inject, Injectable, Signal, signal, TemplateRef, Type} from "@angular/core";
import {BehaviorSubject, filter, Observable, Subject, tap} from "rxjs";

import {SurveyModalUpdateEvent} from "./events/survey-modal-update.event";
import {SURVEY_MODAL_EXTENSION} from "./survey-modals.tokens";
import {SurveyModalEvent} from "./events/survey-modal.event";
import {generateRandomId} from "../../tools/utils";
import {
  surveyModalButtonOptionsDefault,
  surveyModalOptionsDefault,
  SurveyModalEventType,
  SurveyModalType
} from "./survey-modals.constants";
import {
  ISurveyComponentModalConfig,
  ISurveyComponentModalCreateOptions,
  ISurveyModalConfig,
  ISurveyModalCreateOptions,
  ISurveyModalExtension,
  ISurveyModalExtensionOptionsByTypes,
  ISurveyModalExtensionTypeConfig,
  ISurveyTemplateModalConfig,
  ISurveyTemplateModalCreateOptions
} from "./survey-modals.models";
import {
  SurveyComponentModalContainerComponent
} from "./components/modal-container/container-types/component-container/survey-component-modal-container.component";
import {
  SurveyTemplateModalContainerComponent
} from "./components/modal-container/container-types/template-container/survey-template-modal-container.component";

@Injectable()
export class SurveyModalsService<
  ExtensionOptionsByTypesT extends ISurveyModalExtensionOptionsByTypes = ISurveyModalExtensionOptionsByTypes
> {

  public readonly events$ = new Subject<SurveyModalEvent | SurveyModalUpdateEvent>();

  private readonly _extensionsArr = inject<Array<ISurveyModalExtension<ExtensionOptionsByTypesT>>>(SURVEY_MODAL_EXTENSION);

  private readonly _extensions: Record<keyof ExtensionOptionsByTypesT, ISurveyModalExtensionTypeConfig> = <any>{};

  private readonly _modals = signal<Array<ISurveyModalConfig<any>>>([]);

  public get modals(): Signal<Array<ISurveyModalConfig<any>>> {
    return this._modals.asReadonly();
  }

  constructor() {
    this._extensions = this._extensionsArr.reduce(
      (result, extension) => ({...result, ...extension}),
      {}
    ) as Record<keyof ExtensionOptionsByTypesT, ISurveyModalExtensionTypeConfig>;
  }

  public registerExtension(extension: ISurveyModalExtension<any>): void {
    Object.assign(this._extensions, extension);
  }

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
  ): Observable<SurveyComponentModalContainerComponent<ComponentT>>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntil$: Observable<any>
  ): Observable<SurveyComponentModalContainerComponent<ComponentT>>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    options: ISurveyComponentModalCreateOptions<ComponentT>
  ): Observable<SurveyComponentModalContainerComponent<ComponentT>>;

  public showComponent<ComponentT extends object = any>(
    component: Type<ComponentT>,
    takeUntilOrOptions?: Observable<any> | ISurveyComponentModalCreateOptions<ComponentT>
  ): Observable<SurveyComponentModalContainerComponent<ComponentT>> {

    const modal$ = new BehaviorSubject<SurveyComponentModalContainerComponent<ComponentT> | null>(null);
    const modalConfig: ISurveyComponentModalConfig<ComponentT> = {
      ...this._normalizeModalOptions(takeUntilOrOptions),
      type: SurveyModalType.Component,
      component,
      modal$,
    };

    this._modals.set([ ...this._modals(), modalConfig ]);

    this.events$.next(new SurveyModalEvent(
      SurveyModalEventType.BeforeOpen,
      modalConfig,
    ));

    return modal$
      .pipe(
        filter(modalContainerComponent => !!modalContainerComponent),
        tap((modalContainerComponent: SurveyComponentModalContainerComponent<ComponentT>) => {
          this.events$.next(
            new SurveyModalEvent(
              SurveyModalEventType.Open,
              modalConfig,
              modalContainerComponent,
            )
          );
        })
      );
  }

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
  ): Observable<SurveyTemplateModalContainerComponent<ContextT>>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntil$: Observable<unknown>,
  ): Observable<SurveyTemplateModalContainerComponent<ContextT>>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    options: ISurveyTemplateModalCreateOptions<ContextT>,
  ): Observable<SurveyTemplateModalContainerComponent<ContextT>>;

  public showTemplate<ContextT extends object = {}>(
    template: TemplateRef<ContextT>,
    takeUntilOrOptions?: Observable<any> | ISurveyTemplateModalCreateOptions<ContextT>,
  ): Observable<SurveyTemplateModalContainerComponent<ContextT>> {

    const modal$ = new BehaviorSubject<SurveyTemplateModalContainerComponent<ContextT> | null>(null);
    const modalConfig: ISurveyTemplateModalConfig<ContextT> = {
      ...this._normalizeModalOptions(takeUntilOrOptions),
      type: SurveyModalType.Template,
      template,
      modal$,
    };

    this._modals.set([ ...this._modals(), modalConfig ]);

    this.events$.next(
      new SurveyModalEvent(
        SurveyModalEventType.BeforeOpen,
        modalConfig,
      )
    );

    return modal$
      .pipe(
        filter(modalContainerComponent => !!modalContainerComponent),
        tap((modalContainerComponent: SurveyTemplateModalContainerComponent<ContextT>) => {
          this.events$.next(new SurveyModalEvent(
            SurveyModalEventType.Open,
            modalConfig,
            modalContainerComponent,
          ));
        })
      );
  }

  public show<
    ComponentT extends object,
    T extends keyof ExtensionOptionsByTypesT
  >(
    modalType: T,
    options: ExtensionOptionsByTypesT[T]
  ): Observable<SurveyComponentModalContainerComponent<ComponentT>> {

    const modalTypeConfig = this._extensions[modalType];

    if (!modalTypeConfig) {
      throw new Error(`Trying to instantiate modal of unregistered type "${String(modalType)}"`);
    }

    return this.showComponent(
      modalTypeConfig.component,
      modalTypeConfig.convert(options),
    );
  }

  public updateModal(modalId: string, changes: Partial<ISurveyModalCreateOptions<any>>): void {
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

    this.events$.next(new SurveyModalUpdateEvent(
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

    this.events$.next(new SurveyModalEvent(
      SurveyModalEventType.BeforeClose,
      modalConfig,
      modalConfig.modal$.getValue(),
    ));

    this._modals.update(modals => modals.filter(modalConfig => modalConfig.id !== modalId));

    setTimeout(() => {
      this.events$.next(new SurveyModalEvent(
        SurveyModalEventType.Close,
        modalConfig,
        modalConfig.modal$.getValue(),
      ));
    });
  }

  public closeAll(): void {
    const modals = [...this._modals()];

    modals.forEach(modalConfig => {
      this.events$.next(new SurveyModalEvent(
        SurveyModalEventType.BeforeClose,
        modalConfig,
        modalConfig.modal$.getValue(),
      ));
    });

    this._modals.set([]);

    modals.forEach(modalConfig => {
      this.events$.next(new SurveyModalEvent(
        SurveyModalEventType.Close,
        modalConfig,
        modalConfig.modal$.getValue(),
      ));
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
    ModalConfigT extends ISurveyModalConfig<any> = ISurveyModalConfig<any>
  >(modalId: string): ModalConfigT | undefined {
    if (!modalId) {
      return;
    }

    return <ModalConfigT | undefined>this._modals().find(modalConfig => modalConfig.id === modalId);
  }


  // Private implementation

  private _generateModalId(): string {
    return `survey-modal-${generateRandomId()}`;
  }

  private _normalizeModalOptions<ModalOptionsT extends ISurveyModalCreateOptions<any>>(
    takeUntilOrOptions: ModalOptionsT | Observable<unknown> | undefined
  ): ModalOptionsT {
    const options = <ModalOptionsT>{
      ...surveyModalOptionsDefault,
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
          id: `sw-modal-button-${generateRandomId()}`,
          ...surveyModalButtonOptionsDefault,
          ...options.buttons[i]
        }
      }
    }

    return options;
  }
}
