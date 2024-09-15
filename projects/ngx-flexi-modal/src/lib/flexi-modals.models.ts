import {TemplateRef, Type} from "@angular/core";
import {Observable} from "rxjs";

import {FlexiModalButtonDirective} from "./directives/flexi-modal-button/flexi-modal-button.directive";
import {IFlexiModalBasicOptionsByTypes} from "./extensions/basic/flexi-modal-basic.models";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {FlexiModalButton} from "./modals/buttons/flexi-modal-button";
import {FlexiModalComponent} from "./modals/flexi-modal-component";
import {FlexiModalTemplate} from "./modals/flexi-modal-template";
import {modalWidthPresets} from "./flexi-modals.constants";
import {FlexiModal} from "./modals/flexi-modal";

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
  convert: (config: ShortcutModalOptionsT) => Partial<IFlexiComponentModalCreateOptions<ComponentT>>;
}

export type TFlexiModalEvent = (
  FlexiModalBeforeOpenEvent
  | FlexiModalOpenEvent
  | FlexiModalBeforeCloseEvent
  | FlexiModalCloseEvent
  | FlexiModalUpdateEvent
);

// export interface IFlexiModalConfig<ModalContainerT extends FlexiModalContainer<any, any>>
// extends IFlexiModalCreateOptions<ModalContainerT> {
//   type: FlexiModalType;
//   modal$: BehaviorSubject<ModalContainerT | null>;
// }

export interface IFlexiModalCreateOptions {
  // Can be optionally specified. Otherwise, a random id value will be generated instead.
  // Required to be specified in case if you have plans to listen to "(open)" event
  // of a modal defined using the template driven approach. Otherwise, this event
  // will never be triggered.
  id: string;
  // Will be ignored if headerTpl is specified
  title: string | undefined;
  // Will be ignored if footerTpl is specified
  buttons: Array<IFlexiModalButtonConfig> | undefined;
  // Will be ignored if footerTpl is specified
  // buttonsTpl?: Array<FlexiModalButtonDirective>; // Will be ignored if footerTpl is specified
  // headerTpl?: TemplateRef<any> | undefined;
  // footerTpl?: TemplateRef<any> | undefined;
  onClose: (($event: FlexiModalBeforeCloseEvent<any>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<any>) => unknown) | undefined;
  width: TFlexiModalWidth;
  height: TFlexiModalHeight;
  scroll: TFlexiModalScroll;
  closable: boolean;
  classes: Array<string> | undefined;
  aliveUntil: Observable<unknown> | undefined;
  // Random data that can be used to read for example in event listeners.
  // This object doesn't go to any renderable modal content
  data: {};
}

// export interface IFlexiModalCreateOptions<ModalContainerT extends FlexiModalContainer<any, any>> {
//   // Can be optionally specified. Otherwise, a random id value will be generated instead.
//   // Required to be specified in case if you have plans to listen to "(open)" event
//   // of a modal defined with the template driven approach. Otherwise, this event
//   // will never be triggered.
//   id?: string;
//   // Will be ignored if headerTpl is specified
//   title?: string;
//   // Will be ignored if footerTpl is specified
//   buttons?: Array<IFlexiModalButtonConfig>;
//   // Will be ignored if footerTpl is specified
//   // buttonsTpl?: Array<FlexiModalButtonDirective>; // Will be ignored if footerTpl is specified
//   // headerTpl?: TemplateRef<any> | undefined;
//   // footerTpl?: TemplateRef<any> | undefined;
//   onClose?: ($event: FlexiModalBeforeCloseEvent<ModalContainerT>) => unknown;
//   onOpen?: ($event: FlexiModalOpenEvent<ModalContainerT>) => unknown;
//   aliveUntil?: Observable<unknown>;
//   width?: TFlexiModalWidth;
//   height?: TFlexiModalHeight;
//   scroll?: TFlexiModalScroll;
//   closable?: boolean;
//   classes?: Array<string>;
//   // Random data that can be used to read for example in event listeners.
//   // This object doesn't go to any renderable modal content
//   data?: {};
// }

// export interface IFlexiComponentModalConfig<ComponentT = any>
// extends
//   IFlexiModalConfig<FlexiComponentModalContainerComponent<ComponentT>>,
//   IFlexiComponentModalCreateOptions<ComponentT> {
//
//   type: FlexiModalType.Component;
//   component: Type<Component>;
// }

export interface IFlexiComponentModalCreateOptions<
  ComponentT,
  InputsT extends object = Record<string, any>
>
extends IFlexiModalCreateOptions {
  inputs: InputsT;
  onClose: (($event: FlexiModalBeforeCloseEvent<FlexiModalComponent<ComponentT>>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<FlexiModalComponent<ComponentT>>) => unknown) | undefined;
  // injector?: Injector;
  // content?: any[][];
  // ngModule?: Type<any>;
}

// export interface IFlexiTemplateModalConfig<ContextT = any>
// extends
//   IFlexiModalConfig<FlexiTemplateModalContainerComponent<ContextT>>,
//   IFlexiTemplateModalCreateOptions<ContextT> {
//
//   type: FlexiModalType.Template;
//   template: TemplateRef<ContextT>;
// }

export interface IFlexiTemplateModalCreateOptions<ContextT extends object>
extends IFlexiModalCreateOptions {

  context: ContextT | null,
  // injector?: Injector;
  buttonsTpl: Array<FlexiModalButtonDirective>; // Will be ignored if footerTpl is specified
  headerTpl: TemplateRef<any> | undefined;
  footerTpl: TemplateRef<any> | undefined;
  onClose: (($event: FlexiModalBeforeCloseEvent<FlexiModalTemplate<ContextT>>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<FlexiModalTemplate<ContextT>>) => unknown) | undefined;
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
