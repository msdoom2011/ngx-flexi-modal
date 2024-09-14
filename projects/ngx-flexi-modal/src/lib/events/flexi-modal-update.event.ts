import {FlexiModalContainer} from "../components/modal-container/flexi-modal-container";
import {IFlexiModalConfig, IFlexiModalCreateOptions} from "../flexi-modals.models";
import {FlexiModalEventType} from "../flexi-modals.constants";

export class FlexiModalUpdateEvent {

  public readonly type = FlexiModalEventType.Update;

  constructor(
    public config: IFlexiModalConfig<any>,
    public modal: FlexiModalContainer<any, any>,
    public changes: Partial<IFlexiModalCreateOptions<any>>,
  ) {}

  public get id(): string {
    return <string>this.config.id;
  }
}
