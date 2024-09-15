import {FlexiModalContainer} from "../components/modal-container/flexi-modal-container";
import {FlexiModalEventType} from "../flexi-modals.constants";
import {IFlexiModalConfig} from "../flexi-modals.models";

export class FlexiModalEvent<
  ContainerT extends FlexiModalContainer<any, any> = FlexiModalContainer<any, any>
> {

  constructor(
    public type: FlexiModalEventType,
    public config: IFlexiModalConfig<any>,
    public modal?: ContainerT,
  ) {}

  public get id(): string {
    return <string>this.config.id;
  }
}
