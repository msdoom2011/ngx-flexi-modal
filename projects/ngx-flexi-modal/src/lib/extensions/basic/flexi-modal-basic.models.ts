import {Observable} from "rxjs";

import {FlexiModalBeforeCloseEvent} from "../../events/flexi-modal-before-close.event";
import {FlexiModalWithComponent} from "../../modals/flexi-modal-with-component";
import {FlexiModalAction} from "../../modals/actions/flexi-modal-action";

export type TFlexiModalBasicIcon = keyof IFlexiModalBasicOptionsByTypes | null;
export type TFlexiModalBasicAlign = 'left' | 'center' | 'right';

export interface IFlexiModalBasicOptionsByTypes {
  error: IFlexiModalBasicOptions;
  warning: IFlexiModalBasicOptions;
  success: IFlexiModalBasicOptions;
  info: IFlexiModalBasicOptions;
  confirm: IFlexiModalConfirmOptions;
}

export interface IFlexiModalBasicOptions extends IFlexiModalBasicInputs {
  title?: string;
  onOpen?: (($event: FlexiModalBeforeCloseEvent<FlexiModalWithComponent>) => unknown) | undefined;
  onClose?: (($event: FlexiModalBeforeCloseEvent<FlexiModalWithComponent>) => unknown) | undefined;
  aliveUntil?: Observable<unknown>;
  theme?: string;
}

export interface IFlexiModalConfirmOptions extends IFlexiModalBasicOptions {
  onYesLabel?: string;
  onYes?: ($event: MouseEvent, action: FlexiModalAction) => void,
  onNoLabel?: string;
  onNo?: ($event: MouseEvent, action: FlexiModalAction) => void,
}

export interface IFlexiModalBasicInputs {
  message: string | Array<string>;
  messageAlign?: TFlexiModalBasicAlign;
  icon?: TFlexiModalBasicIcon;
}
