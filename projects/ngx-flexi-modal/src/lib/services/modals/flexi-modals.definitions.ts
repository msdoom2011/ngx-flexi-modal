import {InputSignal, TemplateRef, Type} from "@angular/core";
import {AnimationMetadata} from "@angular/animations";
import {Observable} from "rxjs";

import {FlexiModalActionDirective} from "../../components/modal/directives/flexi-modal-action.directive";
import {IFlexiModalBasicOptionsByTypes} from "../../extensions/basic/flexi-modal-basic.definitions";
import {FlexiModalBeforeCloseEvent} from "./events/flexi-modal-before-close.event";
import {FlexiModalBeforeOpenEvent} from "./events/flexi-modal-before-open.event";
import {FlexiModalWithComponent} from "../../models/flexi-modal-with-component";
import {FlexiModalWithTemplate} from "../../models/flexi-modal-with-template";
import {FlexiModalAction} from "../../models/actions/flexi-modal-action";
import {FlexiModalUpdateEvent} from "./events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "./events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "./events/flexi-modal-open.event";
import {modalWidthPresets} from "./flexi-modals.constants";
import {FlexiModal} from "../../models/flexi-modal";

export type TFlexiModalWidth = 'fit-content' | 'fit-window' | (keyof typeof modalWidthPresets) | number;
export type TFlexiModalHeight = 'fit-content' | number;
export type TFlexiModalScroll = 'modal' | 'content';
export type TFlexiModalButtonPosition = 'left' | 'center' | 'right';
export type TFlexiModalPosition = 'top' | 'center';
export type TFlexiModalOpeningAnimation = 'fade-in' | 'zoom-in' | 'zoom-out' | 'slide' | 'appear' | 'fall-down' | 'roll-out';
export type TFlexiModalEvent = (
  FlexiModalBeforeOpenEvent
  | FlexiModalOpenEvent
  | FlexiModalBeforeCloseEvent
  | FlexiModalCloseEvent
  | FlexiModalUpdateEvent
);


// Modal aware component interface

/*
 * Applicable only for components that will be opened via showComponent method
 * Implementing this interface provides access to the modal instance inside the rendered component.
 * The modal input is optional intentionally to ensure ability to use the same component outside the modal context.
 */
export interface IFlexiModalAware {
  modal: InputSignal<FlexiModalWithComponent | undefined>;
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
  options: IFlexiModalComponentOptions<ComponentT>;
  convert: (config: ShortcutModalOptionsT) => IFlexiModalComponentOptions<ComponentT>;
}


// Modal config

export interface IFlexiModalConfig<FlexiModalT extends FlexiModal> {
  id: string;
  title: string | undefined;
  aliveUntil: Observable<unknown> | undefined;
  actions: Array<IFlexiModalActionConfig> | undefined;
  onClose: (($event: FlexiModalBeforeCloseEvent<FlexiModalT>) => unknown) | undefined;
  onOpen: (($event: FlexiModalOpenEvent<FlexiModalT>) => unknown) | undefined;
  animation: TFlexiModalOpeningAnimation;
  position: TFlexiModalPosition;
  scroll: TFlexiModalScroll;
  height: TFlexiModalHeight;
  width: TFlexiModalWidth;
  classes: Array<string> | undefined;
  theme: string | undefined;
  maximized: boolean;
  closable: boolean;
  maximizable: boolean;
  /*
   * Random data that can be used to read for example in event listeners.
   * This object doesn't go to any renderable modal content
   */
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

export type IFlexiModalComponentOptions<ComponentT, InputsT extends object = Record<string, any>
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
  primary: boolean;
  position: TFlexiModalButtonPosition;
  classes: Array<string> | undefined;
  icon: string | undefined;
}

export type IFlexiModalActionOptions = (
  Partial<Omit<IFlexiModalActionConfig, 'label'>>
  & IFlexiModalActionOptionsRequired
);


// Animations

export interface IFlexiModalAnimationConfig {
  fallback: TFlexiModalOpeningAnimation;
  validate: (modalBodyElement: HTMLDivElement) => boolean;
  transition: () => Array<AnimationMetadata>;
}
