import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./base/flexi-modal.event";
import {FlexiModal} from "../modals/flexi-modal";

export class FlexiModalCloseEvent<
  ModalT extends FlexiModal = FlexiModal
> extends FlexiModalEvent<ModalT> {

  public type = FlexiModalEventType.Close;
}
