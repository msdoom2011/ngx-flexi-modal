import {FlexiModalContainer} from "../components/modals-outlet/modal-container/flexi-modal-container";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {IFlexiModalConfig} from "../flexi-modals.models";
import {FlexiModalEvent} from "./base/flexi-modal.event";

export class FlexiModalCloseEvent<
  ContainerT extends FlexiModalContainer<any, any> = FlexiModalContainer<any, any>
> extends FlexiModalEvent {

  public type = FlexiModalEventType.Close;

  constructor(
    config: IFlexiModalConfig<any>,
    public modal: ContainerT,
  ) {
    super(config);
  }
}
