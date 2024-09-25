import {FlexiModalPreventableEvent} from "./abstract/flexi-modal-preventable.event";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModal} from "../../../models/flexi-modal";

export class FlexiModalBeforeOpenEvent<
  ModalT extends FlexiModal = FlexiModal
>
extends FlexiModalPreventableEvent<ModalT> {

  public readonly type = FlexiModalEventType.BeforeOpen;
}
