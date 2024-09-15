import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./base/flexi-modal.event";
import {FlexiModal} from "../modals/flexi-modal";

export class FlexiModalCloseEvent<
  // ContainerT extends FlexiModalContainer<any, any> = FlexiModalContainer<any, any>
  ModalT extends FlexiModal = FlexiModal
> extends FlexiModalEvent<ModalT> {

  public type = FlexiModalEventType.Close;

  // constructor(
  //   config: IFlexiModalConfig<any>,
  //   public modal: ContainerT,
  // ) {
  //   super(config);
  // }
}
