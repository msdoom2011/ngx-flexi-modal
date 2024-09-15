import {FlexiModalContainer} from "../components/modals-outlet/modal-container/flexi-modal-container";
import {FlexiModalPreventableEvent} from "./base/flexi-modal-preventable.event";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {IFlexiModalConfig} from "../flexi-modals.models";

export class FlexiModalBeforeCloseEvent<
  ContainerT extends FlexiModalContainer<any, any> = FlexiModalContainer<any, any>
> extends FlexiModalPreventableEvent {

  public type = FlexiModalEventType.BeforeClose;

  constructor(
    config: IFlexiModalConfig<any>,
    public modal: ContainerT,
  ) {
    super(config);
  }
}
