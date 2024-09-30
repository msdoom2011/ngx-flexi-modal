import {IFmModalOptions} from "../../services/modals/flexi-modals.definitions";
import {FmModalWithComponent} from "../../models/fm-modal-with-component";
import {FmModalAction} from "../../models/actions/fm-modal-action";

export type TFmModalBasicIcon = keyof IFmModalBasicExtensionOptionsByTypes | null;
export type TFmModalBasicAlign = 'left' | 'center' | 'right';

export interface IFmModalBasicExtensionOptionsByTypes {
  error: IFmModalBasicOptions;
  warning: IFmModalBasicOptions;
  success: IFmModalBasicOptions;
  info: IFmModalBasicOptions;
  confirm: IFmModalConfirmOptions;
}

export interface IFmModalBasicOptions
extends
  IFmModalOptions<FmModalWithComponent>,
  IFmModalBasicInputs
{
  // Nothing goes here
}

export interface IFmModalConfirmOptions extends IFmModalBasicOptions {
  onYesLabel?: string;
  onYes?: ($event: MouseEvent, action: FmModalAction) => void,
  onNoLabel?: string;
  onNo?: ($event: MouseEvent, action: FmModalAction) => void,
}

export interface IFmModalBasicInputs {
  message: string | Array<string>;
  messageAlign?: TFmModalBasicAlign;
  icon?: TFmModalBasicIcon;
}