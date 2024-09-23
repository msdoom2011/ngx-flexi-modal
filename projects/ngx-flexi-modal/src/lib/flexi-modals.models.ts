import {InputSignal, TemplateRef, Type} from "@angular/core";
import {Observable} from "rxjs";

import {IFlexiModalBasicOptionsByTypes} from "./extensions/basic/flexi-modal-basic.models";
import {FlexiModalActionDirective} from "./directives/flexi-modal-action.directive";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalWithComponent} from "./modals/flexi-modal-with-component";
import {FlexiModalWithTemplate} from "./modals/flexi-modal-with-template";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalAction} from "./modals/actions/flexi-modal-action";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {modalWidthPresets} from "./flexi-modals.constants";
import {FlexiModal} from "./modals/flexi-modal";

export type TFlexiModalWidth = 'fit-content' | 'fit-window' | (keyof typeof modalWidthPresets) | number;
export type TFlexiModalHeight = 'fit-content' | number;
export type TFlexiModalScroll = 'modal' | 'content';
export type TFlexiModalButtonTheme = 'primary' | 'secondary';
export type TFlexiModalButtonPosition = 'left' | 'center' | 'right';
export type TFlexiModalEvent = (
  FlexiModalBeforeOpenEvent
  | FlexiModalOpenEvent
  | FlexiModalBeforeCloseEvent
  | FlexiModalCloseEvent
  | FlexiModalUpdateEvent
);


// Modal aware component interface

// Applicable only for components that will be opened via showComponent method
// Implementing this interface provides access to the modal instance inside the rendered component.
export interface IFlexiModalAware {
  modal: InputSignal<FlexiModalWithComponent>;
}


// Extensions

export interface IFlexiModalExtensionOptionsByTypes extends IFlexiModalBasicOptionsByTypes {
  // Must be empty here
}

export type IFlexiModalExtension<ModalTypeT extends IFlexiModalExtensionOptionsByTypes> = {
  [K in keyof ModalTypeT]: IFlexiModalExtensionTypeConfig;
}

export interface IFlexiModalExtensionTypeConfig<
  ShortcutModalOptionsT extends object = any,
  ComponentT = any
> {
  component: Type<ComponentT>;
  convert: (config: ShortcutModalOptionsT) => IFlexiModalComponentOptions<ComponentT>;
}


// Modal config

export interface IFlexiModalConfig<FlexiModalT extends FlexiModal> {
  id: string;
  title: string | undefined;
  actions: Array<IFlexiModalActionConfig> | undefined;
  onClose: (($event: FlexiModalBeforeCloseEvent<FlexiModalT>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<FlexiModalT>) => unknown) | undefined;
  width: TFlexiModalWidth;
  height: TFlexiModalHeight;
  scroll: TFlexiModalScroll;
  closable: boolean;
  classes: Array<string> | undefined;
  theme: string | undefined;
  aliveUntil: Observable<unknown> | undefined;
  // Random data that can be used to read for example in event listeners.
  // This object doesn't go to any renderable modal content
  data: {};
}

type TModalOptions<ConfigT extends IFlexiModalConfig<any>> = (
  Partial<Omit<ConfigT, 'actions'>>
  & { actions?: Array<IFlexiModalActionOptions> }
);

export type IFlexiModalOptions<
  FlexiModalT extends FlexiModal
> = TModalOptions<IFlexiModalConfig<FlexiModalT>>;


// Component Modals

export interface IFlexiModalComponentConfig<ComponentT, InputsT extends object = Record<string, any>>
extends IFlexiModalConfig<FlexiModalWithComponent<ComponentT>> {
  inputs: InputsT;
}

export type IFlexiModalComponentOptions<
  ComponentT, InputsT extends object = Record<string, any>
> = TModalOptions<IFlexiModalComponentConfig<ComponentT, InputsT>>;


// Template Modals

export interface IFlexiModalTemplateConfig<ContextT extends object>
extends IFlexiModalConfig<FlexiModalWithTemplate<ContextT>> {
  context: ContextT | null,
  headerTpl: TemplateRef<unknown> | undefined;
  footerTpl: TemplateRef<unknown> | undefined;
  actionsTpl: Array<FlexiModalActionDirective>;
}

export type IFlexiModalTemplateOptions<
  ContextT extends object
> = TModalOptions<IFlexiModalTemplateConfig<ContextT>>;


// Actions

interface IFlexiModalActionOptionsRequired {
  label: string;
}

export interface IFlexiModalActionConfig {
  id: string;
  label: string;
  onClick: (($event: MouseEvent, action: FlexiModalAction) => unknown) | undefined;
  disabled: boolean;
  closeOnClick: boolean;
  theme: TFlexiModalButtonTheme;
  position: TFlexiModalButtonPosition;
  classes: Array<string> | undefined;
  icon: string | undefined;
}

export type IFlexiModalActionOptions = (
  Partial<Omit<IFlexiModalActionConfig, 'label'>>
  & IFlexiModalActionOptionsRequired
);
