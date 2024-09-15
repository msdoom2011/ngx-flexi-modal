import {FlexiModalContainer} from "../components/modals-outlet/modal-container/flexi-modal-container";
import {IFlexiModalConfig, IFlexiModalCreateOptions} from "../flexi-modals.models";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {FlexiModalEvent} from "./base/flexi-modal.event";

export class FlexiModalUpdateEvent extends FlexiModalEvent {

  public readonly type = FlexiModalEventType.Update;

  constructor(
    config: IFlexiModalConfig<any>,
    public modal: FlexiModalContainer<any, any>,
    public changes: Partial<IFlexiModalCreateOptions<any>>,
  ) {
    super(config)
  }
}
