import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./abstract/flexi-modal.event";
import {FlexiModal} from "../../../models/flexi-modal";

export class FlexiModalOpenEvent<
  ModalT extends FlexiModal = FlexiModal
> extends FlexiModalEvent<ModalT> {

  public type = FlexiModalEventType.Open;
}
