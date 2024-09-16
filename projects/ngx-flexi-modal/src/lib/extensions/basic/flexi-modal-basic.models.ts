import {Observable} from "rxjs";

import {FlexiModalButton} from "../../modals/buttons/flexi-modal-button";
import {
  FlexiModalComponentInstanceComponent
} from "../../components/modals-outlet/modal-instance/instance-types/component/flexi-modal-component-instance.component";

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
  onClose?: (modal: FlexiModalComponentInstanceComponent<any>) => void;
  aliveUntil?: Observable<unknown>;
}

export interface IFlexiModalConfirmOptions extends IFlexiModalBasicOptions {
  onYesLabel?: string;
  onYes?: ($event: MouseEvent, button: FlexiModalButton) => void,
  onNoLabel?: string;
  onNo?: ($event: MouseEvent, button: FlexiModalButton) => void,
}

export interface IFlexiModalBasicInputs {
  message: string | Array<string>;
  messageAlign?: TFlexiModalBasicAlign;
  icon?: TFlexiModalBasicIcon;
}
