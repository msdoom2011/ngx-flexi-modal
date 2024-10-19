import {InputSignal, TemplateRef, Type} from '@angular/core';
import {Observable} from 'rxjs';

import {FmModalActionDirective} from '../../components/modal/directives/fm-modal-action.directive';
import {IFmModalBasicExtensionOptionsByModalTypes} from '../../extensions/basic/fm-modal-basic.definitions';
import {FmModalBeforeCloseEvent} from './events/fm-modal-before-close.event';
import {FmModalBeforeOpenEvent} from './events/fm-modal-before-open.event';
import {FmModalWithComponent} from '../../models/fm-modal-with-component';
import {FmModalWithTemplate} from '../../models/fm-modal-with-template';
import {FmModalAction} from '../../models/actions/fm-modal-action';
import {FmModalUpdateEvent} from './events/fm-modal-update.event';
import {FmModalCloseEvent} from './events/fm-modal-close.event';
import {FmModalOpenEvent} from './events/fm-modal-open.event';
import {fmModalWidthPresets} from './flexi-modals.constants';
import {FmModal} from '../../models/fm-modal';

export type TFmModalWidth = 'fit-content' | 'fit-window' | (keyof typeof fmModalWidthPresets) | number;
export type TFmModalHeight = 'fit-content' | number;
export type TFmModalScroll = 'modal' | 'content';
export type TFmModalButtonPosition = 'left' | 'center' | 'right';
export type TFmModalPosition = 'top' | 'center';
export type TFmModalOpeningAnimation = 'fade-in' | 'zoom-in' | 'zoom-out' | 'slide' | 'appear' | 'fall-down' | 'roll-out';
export type TFmModalSpinnerType = 'round-dotted' | 'round-dashed' | 'linear-dotted' | 'linear-dashed';
export type TFmModalEvent = (
  FmModalBeforeOpenEvent
  | FmModalOpenEvent
  | FmModalBeforeCloseEvent
  | FmModalCloseEvent
  | FmModalUpdateEvent
);


// Modal aware component interface

/*
 * Applicable only for components that will be opened via showComponent method
 * Implementing this interface provides access to the modal instance inside the rendered component.
 * The modal input is optional intentionally to ensure ability to use the same component outside the modal context.
 */
export interface IFlexiModalAware {
  modal: InputSignal<FmModalWithComponent | undefined>;
}


// Extensions

/**
 * An interface that is used for inheritance in case of creating your own extension
 */
export interface IFmExtensionOptionsByModalTypes extends IFmModalBasicExtensionOptionsByModalTypes {
  // Must be empty here
}

export type IFmExtension<ModalTypeT extends IFmExtensionOptionsByModalTypes> = {
  [K in keyof ModalTypeT]: IFmExtensionModalTypeConfig;
}

export interface IFmExtensionModalTypeConfig<
  ShortcutModalOptionsT extends Record<string, unknown> = any,
  ComponentT = any
> {
  component: Type<ComponentT>;
  options: IFmModalWithComponentOptions<ComponentT>;
  convert: (config: ShortcutModalOptionsT) => IFmModalWithComponentOptions<ComponentT>;
}


// Modal config

export interface IFmModalConfig<ModalT extends FmModal = FmModal> {
  id: string;
  title: string | undefined;
  actions: Array<IFmModalActionConfig> | undefined;
  openUntil: Observable<unknown> | undefined;
  headerTpl: TemplateRef<unknown> | undefined;
  footerTpl: TemplateRef<unknown> | undefined;
  actionsTpl: Array<FmModalActionDirective> | undefined;
  onOpen: (($event: FmModalOpenEvent<ModalT>) => void) | undefined;
  onClose: (($event: FmModalBeforeCloseEvent<ModalT>) => void) | undefined;
  animation: TFmModalOpeningAnimation;
  position: TFmModalPosition;
  spinner: TFmModalSpinnerType;
  scroll: TFmModalScroll;
  height: TFmModalHeight;
  width: TFmModalWidth;
  classes: Array<string> | undefined;
  theme: string | undefined;
  maximized: boolean;
  closable: boolean;
  maximizable: boolean;
  /*
   * Random data that can be used to read for example in event listeners.
   * This object doesn't go to any renderable modal content
   */
  data: Record<string, unknown>;
}

type TModalOptions<ConfigT extends IFmModalConfig<any>> = (
  Partial<Omit<ConfigT, 'actions'>>
  & { actions?: Array<IFmModalActionOptions> }
);

export type IFmModalOptions<ModalT extends FmModal = FmModal> = TModalOptions<IFmModalConfig<ModalT>>;


// Component Modals

export interface IFmModalWithComponentConfig<
  ComponentT,
  InputsT extends Record<string, unknown> = Record<string, unknown>
>
extends IFmModalConfig<FmModalWithComponent<ComponentT>> {
  inputs: InputsT;
}

export type IFmModalWithComponentOptions<
  ComponentT,
  InputsT extends Record<string, unknown> = Record<string, unknown>
> = TModalOptions<IFmModalWithComponentConfig<ComponentT, InputsT>>;


// Template Modals

export interface IFmModalWithTemplateConfig<
  ContextT extends Record<string, unknown> = Record<string, unknown>
>
extends IFmModalConfig<FmModalWithTemplate<ContextT>> {
  context: ContextT | null,
}

export type IFmModalWithTemplateOptions<
  ContextT extends Record<string, unknown> = Record<string, unknown>
> = TModalOptions<IFmModalWithTemplateConfig<ContextT>>;


// Actions

interface IFmModalActionOptionsRequired {
  label: string;
}

export interface IFmModalActionConfig {
  id: string;
  label: string;
  onClick: (($event: MouseEvent, action: FmModalAction) => unknown) | undefined;
  disabled: boolean;
  closeOnClick: boolean;
  primary: boolean;
  position: TFmModalButtonPosition;
  classes: Array<string> | undefined;
  icon: string | undefined;
}

export type IFmModalActionOptions = (
  Partial<Omit<IFmModalActionConfig, 'label'>>
  & IFmModalActionOptionsRequired
);
