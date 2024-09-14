import {FlexiModalContainer} from "../components/modal-container/flexi-modal-container";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {IFlexiModalConfig} from "../flexi-modals.models";

export class FlexiModalEvent {

  constructor(
    public type: FlexiModalEventType,
    public config: IFlexiModalConfig<any>,
    public modal?: FlexiModalContainer<any, any>,
  ) {}

  public get id(): string {
    return <string>this.config.id;
  }
}
