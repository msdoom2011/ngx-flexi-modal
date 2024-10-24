import {TemplateRef, Type} from '@angular/core';
import {Observable} from 'rxjs';

import {IFmModalBasicPresetsOptionsByModalTypes} from '../../presets/basic/fm-modal-basic.definitions';
import {FmModalActionDirective} from '../../components/modal/directives/fm-modal-action.directive';
import { FmModalMaximizedChangeEvent } from './events/fm-modal-maximized-change.event';
import { FmModalContentChangeEvent } from './events/fm-modal-content-change.event';
import {FmModalBeforeCloseEvent} from './events/fm-modal-before-close.event';
import {FmModalBeforeOpenEvent} from './events/fm-modal-before-open.event';
import {FmModalWithComponent} from '../../models/fm-modal-with-component';
import {FmModalWithTemplate} from '../../models/fm-modal-with-template';
import { FmModalActiveEvent } from './events/fm-modal-active.event';
import {FmModalAction} from '../../models/actions/fm-modal-action';
import { FmModalReadyEvent } from './events/fm-modal-ready.event';
import {FmModalUpdateEvent} from './events/fm-modal-update.event';
import {FmModalCloseEvent} from './events/fm-modal-close.event';
import {FmModalOpenEvent} from './events/fm-modal-open.event';
import {FmModal} from '../../models/fm-modal';
import { IFmModalAware } from '../../components/fm-modal.abstract';

export type TFmWidthPreset = 'tiny' | 'small' | 'medium' | 'big' | 'large';
export type TFmModalWidth = 'fit-content' | 'fit-window' | TFmWidthPreset | number;
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
  | FmModalReadyEvent
  | FmModalActiveEvent
  | FmModalContentChangeEvent
  | FmModalMaximizedChangeEvent
);


// Presets

/**
 * An interface that is used for inheritance in case of creating your own presets
 */
export interface IFmModalPresetOptionsByModalTypes extends IFmModalBasicPresetsOptionsByModalTypes {
  // Must be empty here
}

export type IFmModalPresets<ModalTypeT extends IFmModalPresetOptionsByModalTypes> = {
  [K in keyof ModalTypeT]: IFmModalPresetConfig;
}

export interface IFmModalPresetConfig<
  ShortcutModalOptionsT extends Record<string, unknown> = any,
  ComponentT extends Partial<IFmModalAware> = any
> {
  component: Type<ComponentT>;
  options: IFmModalWithComponentOptions<ComponentT>;
  convert: (config: ShortcutModalOptionsT) => IFmModalWithComponentOptions<ComponentT>;
}


// Definition of the open modal function

/**
 * Useful in case if there is need to extend current library by either new modal factory
 * or custom presets.
 */
export interface IFmOpenModalFn {

  // open modal with component as a content

  <
    InputsT extends object = Record<string, any>,
    ComponentT extends Partial<IFmModalAware> = object
  >(
    component: Type<ComponentT> | Promise<Type<ComponentT>>,
  ): FmModalWithComponent<ComponentT, InputsT> | null;

  <
    InputsT extends object = Record<string, any>,
    ComponentT extends Partial<IFmModalAware> = object
  >(
    component: Type<ComponentT> | Promise<Type<ComponentT>>,
    openUntil$: Observable<any>
  ): FmModalWithComponent<ComponentT, InputsT> | null;

  <
    InputsT extends object = Record<string, any>,
    ComponentT extends Partial<IFmModalAware> = object
  >(
    component: Type<ComponentT> | Promise<Type<ComponentT>>,
    options: IFmModalWithComponentOptions<ComponentT>
  ): FmModalWithComponent<ComponentT, InputsT> | null;


  // open modal with template as a content

  <ContextT extends Record<string, unknown>>(
    template: TemplateRef<ContextT>,
  ): FmModalWithTemplate<ContextT> | null;

  <ContextT extends Record<string, unknown>>(
    template: TemplateRef<ContextT>,
    openUntil$: Observable<unknown>,
  ): FmModalWithTemplate<ContextT> | null;

  <ContextT extends Record<string, unknown>>(
    template: TemplateRef<ContextT>,
    options: IFmModalWithTemplateOptions<ContextT>,
  ): FmModalWithTemplate<ContextT> | null;


  // open modal using a preset

  <
    ComponentT extends Partial<IFmModalAware>,
    PresetT extends keyof IFmModalPresetOptionsByModalTypes
  >(
    modalType: PresetT,
    options: IFmModalPresetOptionsByModalTypes[PresetT]
  ): FmModalWithComponent<ComponentT> | null;
}


// Modal config

export interface IFmModalConfig<ModalT extends FmModal = FmModal<any, any>> {
  id: string;
  title: string | undefined;
  actions: Array<IFmModalActionConfig> | undefined;
  openUntil: Observable<unknown> | undefined;
  headerTpl: TemplateRef<unknown> | undefined;
  footerTpl: TemplateRef<unknown> | undefined;
  actionsTpl: Array<FmModalActionDirective> | undefined;
  onOpen: (($event: FmModalOpenEvent<ModalT>) => void) | undefined;
  onClose: (($event: FmModalBeforeCloseEvent<ModalT>) => void) | undefined;
  onMaximize: (($event: FmModalMaximizedChangeEvent<ModalT>) => void) | undefined;
  onMinimize: (($event: FmModalMaximizedChangeEvent<ModalT>) => void) | undefined;
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
  ComponentT extends Partial<IFmModalAware>,
  InputsT extends object = Record<string, unknown>
>
extends IFmModalConfig<FmModalWithComponent<ComponentT>> {
  inputs: InputsT;
}

export type IFmModalWithComponentOptions<
  ComponentT extends Partial<IFmModalAware>,
  InputsT extends object = Record<string, unknown>
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
  autofocus: boolean;
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
