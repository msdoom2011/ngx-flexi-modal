import {Component, Injector, TemplateRef, Type} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

import {SurveyModalContainerComponent} from "./components/modal-container/survey-modal-container.component";
import {SurveyModalButtonDirective} from "./directives/survey-modal-button/survey-modal-button.directive";
import {SurveyModalButton} from "./components/modal-container/survey-modal-button";
import {IModalBasicOptionsByTypes} from "./modals/basic/survey-modal-basic.models";
import {modalWidthPresets, SurveyModalType} from "./survey-modals.constants";
import {
  SurveyComponentModalContainerComponent
} from "./components/modal-container/container-types/component-container/survey-component-modal-container.component";
import {
  SurveyTemplateModalContainerComponent
} from "./components/modal-container/container-types/template-container/survey-template-modal-container.component";

export type TSurveyModalWidth = 'fit-content' | 'fit-window' | (keyof typeof modalWidthPresets) | number;
export type TSurveyModalHeight = 'fit-content' | number;
export type TSurveyModalScroll = 'modal' | 'content';
export type TSurveyModalButtonTheme = 'primary' | 'secondary';
export type TSurveyModalButtonPosition = 'left' | 'center' | 'right';

export interface ISurveyModalExtensionOptionsByTypes extends IModalBasicOptionsByTypes {}

export type ISurveyModalExtension<ModalTypeT extends ISurveyModalExtensionOptionsByTypes> = {
  [K in keyof ModalTypeT]: ISurveyModalExtensionTypeConfig;
}

export interface ISurveyModalExtensionTypeConfig<
  ShortcutModalOptionsT extends object = any,
  ComponentT = any
> {
  component: Type<ComponentT>;
  convert: (config: ShortcutModalOptionsT) => ISurveyComponentModalCreateOptions<ComponentT>;
}

export interface ISurveyModalConfig<ModalContainerT extends SurveyModalContainerComponent<any, any>>
extends ISurveyModalCreateOptions<ModalContainerT> {
  type: SurveyModalType;
  modal$: BehaviorSubject<ModalContainerT | null>;
}

export interface ISurveyModalCreateOptions<ModalContainerT> {
  // Can be optionally specified. Otherwise, a random id value will be generated instead.
  // Required to be specified in case if you have plans to listen to "(open)" event
  // of a modal defined with the template driven approach. Otherwise, this event
  // will never be triggered.
  id?: string;
  // Will be ignored if headerTpl is specified
  title?: string;
  // Will be ignored if footerTpl is specified
  buttons?: Array<ISurveyModalButtonConfig>;
  // Will be ignored if footerTpl is specified
  buttonsTpl?: Array<SurveyModalButtonDirective>; // Will be ignored if footerTpl is specified
  headerTpl?: TemplateRef<any> | undefined;
  footerTpl?: TemplateRef<any> | undefined;
  onClose?: (modal: ModalContainerT) => unknown;
  onOpen?: (modal: ModalContainerT) => unknown;
  aliveUntil?: Observable<unknown>;
  width?: TSurveyModalWidth;
  height?: TSurveyModalHeight;
  scroll?: TSurveyModalScroll;
  closable?: boolean;
  classes?: Array<string>;
}

export interface ISurveyComponentModalConfig<ComponentT = any>
extends
  ISurveyModalConfig<SurveyComponentModalContainerComponent<ComponentT>>,
  ISurveyComponentModalCreateOptions<ComponentT> {

  type: SurveyModalType.Component;
  component: Type<Component>;
}

export interface ISurveyComponentModalCreateOptions<
  ComponentT,
  InputsT extends object = Record<string, any>
>
extends ISurveyModalCreateOptions<SurveyComponentModalContainerComponent<ComponentT>> {

  inputs?: InputsT;
  injector?: Injector;
  content?: any[][];
  ngModule?: Type<any>;
}

export interface ISurveyTemplateModalConfig<ContextT = any>
extends
  ISurveyModalConfig<SurveyTemplateModalContainerComponent<ContextT>>,
  ISurveyTemplateModalCreateOptions<ContextT> {

  type: SurveyModalType.Template;
  template: TemplateRef<ContextT>;
}

export interface ISurveyTemplateModalCreateOptions<ContextT>
extends ISurveyModalCreateOptions<SurveyTemplateModalContainerComponent<ContextT>> {

  context?: ContextT | null,
  injector?: Injector;
}

export interface ISurveyModalButtonConfig {
  label: string;
  onClick?: ($event: MouseEvent, button: SurveyModalButton) => unknown;
  id?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
  theme?: TSurveyModalButtonTheme;
  position?: TSurveyModalButtonPosition;
  classes?: Array<string>;
  icon?: string;
}
