import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./abstract/flexi-modal.event";
import {FlexiModal} from "../../../models/flexi-modal";

export class FlexiModalCloseEvent<
  ModalT extends FlexiModal = FlexiModal
> extends FlexiModalEvent<ModalT> {

  public readonly type = FlexiModalEventType.Close;
}
