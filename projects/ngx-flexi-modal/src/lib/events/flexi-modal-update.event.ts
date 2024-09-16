import {IFlexiModalOptions} from "../flexi-modals.models";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./base/flexi-modal.event";
import {FlexiModal} from "../modals/flexi-modal";

export class FlexiModalUpdateEvent<
  ModalT extends FlexiModal = FlexiModal,
  OptionsT extends IFlexiModalOptions<any> = IFlexiModalOptions<any>
>
extends FlexiModalEvent<ModalT> {

  public readonly type = FlexiModalEventType.Update;

  constructor(
    modal: ModalT,
    public changes: OptionsT,
  ) {
    super(modal);
  }
}
