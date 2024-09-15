import {FlexiModalPreventableEvent} from "./base/flexi-modal-preventable.event";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModal} from "../modals/flexi-modal";

export class FlexiModalBeforeCloseEvent<
  ModalT extends FlexiModal = FlexiModal
>
extends FlexiModalPreventableEvent<ModalT> {

  public type = FlexiModalEventType.BeforeClose;
}
