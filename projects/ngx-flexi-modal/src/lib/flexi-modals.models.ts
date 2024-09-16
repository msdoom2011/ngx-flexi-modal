import {InputSignal, TemplateRef, Type} from "@angular/core";
import {Observable} from "rxjs";

import {FlexiModalButtonDirective} from "./directives/flexi-modal-button/flexi-modal-button.directive";
import {IFlexiModalBasicOptionsByTypes} from "./extensions/basic/flexi-modal-basic.models";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalWithComponent} from "./modals/flexi-modal-with-component";
import {FlexiModalWithTemplate} from "./modals/flexi-modal-with-template";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalButton} from "./modals/buttons/flexi-modal-button";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {modalWidthPresets} from "./flexi-modals.constants";

export type TFlexiModalWidth = 'fit-content' | 'fit-window' | (keyof typeof modalWidthPresets) | number;
export type TFlexiModalHeight = 'fit-content' | number;
export type TFlexiModalScroll = 'modal' | 'content';
export type TFlexiModalButtonTheme = 'primary' | 'secondary';
export type TFlexiModalButtonPosition = 'left' | 'center' | 'right';

// Applicable only for components that will be opened via showComponent method
// Implementing this interface provides access to the modal instance inside the rendered component.
export interface IFlexiModalAware {
  modal: InputSignal<FlexiModalWithComponent>;
}

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

export interface IFlexiModalCreateOptions {
  // Can be optionally specified. Otherwise, a random id value will be generated instead.
  // Required to be specified in case if you have plans to listen to "(open)" event
  // of a modal defined using the template driven approach. Otherwise, this event
  // will never be triggered.
  id: string;
  title: string | undefined;
  buttons: Array<IFlexiModalButtonConfig> | undefined;
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

export interface IFlexiComponentModalCreateOptions<
  ComponentT,
  InputsT extends object = Record<string, any>
>
extends IFlexiModalCreateOptions {
  inputs: InputsT;
  onClose: (($event: FlexiModalBeforeCloseEvent<FlexiModalWithComponent<ComponentT>>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<FlexiModalWithComponent<ComponentT>>) => unknown) | undefined;
}

export interface IFlexiTemplateModalCreateOptions<
  ContextT extends object
>
extends IFlexiModalCreateOptions {
  context: ContextT | null,
  headerTpl: TemplateRef<any> | undefined;
  footerTpl: TemplateRef<any> | undefined;
  buttonsTpl: Array<FlexiModalButtonDirective>; // Will be ignored if footerTpl is specified
  onClose: (($event: FlexiModalBeforeCloseEvent<FlexiModalWithTemplate<ContextT>>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<FlexiModalWithTemplate<ContextT>>) => unknown) | undefined;
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
