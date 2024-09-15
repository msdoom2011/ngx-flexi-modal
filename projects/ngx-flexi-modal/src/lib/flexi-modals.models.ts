import {Component, Injector, TemplateRef, Type} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

import {FlexiModalContainer} from "./components/modals-outlet/modal-container/flexi-modal-container";
import {FlexiModalButtonDirective} from "./directives/flexi-modal-button/flexi-modal-button.directive";
import {FlexiModalButton} from "./components/modals-outlet/modal-container/flexi-modal-button";
import {IFlexiModalBasicOptionsByTypes} from "./extensions/basic/flexi-modal-basic.models";
import {modalWidthPresets, FlexiModalType} from "./flexi-modals.constants";
import {
  FlexiComponentModalContainerComponent
} from "./components/modals-outlet/modal-container/container-types/component/flexi-component-modal-container.component";
import {
  FlexiTemplateModalContainerComponent
} from "./components/modals-outlet/modal-container/container-types/template/flexi-template-modal-container.component";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";

export type TFlexiModalWidth = 'fit-content' | 'fit-window' | (keyof typeof modalWidthPresets) | number;
export type TFlexiModalHeight = 'fit-content' | number;
export type TFlexiModalScroll = 'modal' | 'content';
export type TFlexiModalButtonTheme = 'primary' | 'secondary';
export type TFlexiModalButtonPosition = 'left' | 'center' | 'right';

export interface IFlexiModalExtensionOptionsByTypes extends IFlexiModalBasicOptionsByTypes {}

export type IFlexiModalExtension<ModalTypeT extends IFlexiModalExtensionOptionsByTypes> = {
  [K in keyof ModalTypeT]: IFlexiModalExtensionTypeConfig;
}

export interface IFlexiModalExtensionTypeConfig<
  ShortcutModalOptionsT extends object = any,
  ComponentT = any
> {
  component: Type<ComponentT>;
  convert: (config: ShortcutModalOptionsT) => IFlexiComponentModalCreateOptions<ComponentT>;
}

export type TFlexiModalEvent = (
  FlexiModalBeforeOpenEvent
  | FlexiModalOpenEvent
  | FlexiModalBeforeCloseEvent
  | FlexiModalCloseEvent
  | FlexiModalUpdateEvent
);

export interface IFlexiModalConfig<ModalContainerT extends FlexiModalContainer<any, any>>
extends IFlexiModalCreateOptions<ModalContainerT> {
  type: FlexiModalType;
  modal$: BehaviorSubject<ModalContainerT | null>;
}

export interface IFlexiModalCreateOptions<ModalContainerT extends FlexiModalContainer<any, any>> {
  // Can be optionally specified. Otherwise, a random id value will be generated instead.
  // Required to be specified in case if you have plans to listen to "(open)" event
  // of a modal defined with the template driven approach. Otherwise, this event
  // will never be triggered.
  id?: string;
  // Will be ignored if headerTpl is specified
  title?: string;
  // Will be ignored if footerTpl is specified
  buttons?: Array<IFlexiModalButtonConfig>;
  // Will be ignored if footerTpl is specified
  buttonsTpl?: Array<FlexiModalButtonDirective>; // Will be ignored if footerTpl is specified
  headerTpl?: TemplateRef<any> | undefined;
  footerTpl?: TemplateRef<any> | undefined;
  onClose?: ($event: FlexiModalBeforeCloseEvent<ModalContainerT>) => unknown;
  onOpen?: ($event: FlexiModalOpenEvent<ModalContainerT>) => unknown;
  aliveUntil?: Observable<unknown>;
  width?: TFlexiModalWidth;
  height?: TFlexiModalHeight;
  scroll?: TFlexiModalScroll;
  closable?: boolean;
  classes?: Array<string>;
  // Random data that can be used to read for example in event listeners.
  // This object doesn't go to any renderable modal content
  data?: {};
}

export interface IFlexiComponentModalConfig<ComponentT = any>
extends
  IFlexiModalConfig<FlexiComponentModalContainerComponent<ComponentT>>,
  IFlexiComponentModalCreateOptions<ComponentT> {

  type: FlexiModalType.Component;
  component: Type<Component>;
}

export interface IFlexiComponentModalCreateOptions<
  ComponentT,
  InputsT extends object = Record<string, any>
>
extends IFlexiModalCreateOptions<FlexiComponentModalContainerComponent<ComponentT>> {

  inputs?: InputsT;
  injector?: Injector;
  content?: any[][];
  ngModule?: Type<any>;
}

export interface IFlexiTemplateModalConfig<ContextT = any>
extends
  IFlexiModalConfig<FlexiTemplateModalContainerComponent<ContextT>>,
  IFlexiTemplateModalCreateOptions<ContextT> {

  type: FlexiModalType.Template;
  template: TemplateRef<ContextT>;
}

export interface IFlexiTemplateModalCreateOptions<ContextT>
extends IFlexiModalCreateOptions<FlexiTemplateModalContainerComponent<ContextT>> {

  context?: ContextT | null,
  injector?: Injector;
}

export interface IFlexiModalButtonConfig {
  label: string;
  onClick?: ($event: MouseEvent, button: FlexiModalButton) => unknown;
  id?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
  theme?: TFlexiModalButtonTheme;
  position?: TFlexiModalButtonPosition;
  classes?: Array<string>;
  icon?: string;
}
