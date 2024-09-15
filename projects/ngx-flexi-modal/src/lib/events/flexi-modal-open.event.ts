import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./base/flexi-modal.event";
import {FlexiModal} from "../modals/flexi-modal";

export class FlexiModalOpenEvent<
  ModalT extends FlexiModal = FlexiModal
> extends FlexiModalEvent<ModalT> {

  public type = FlexiModalEventType.Open;
}
