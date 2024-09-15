import {FlexiModalEventType} from "../../flexi-modals.constants";
import {IFlexiModalConfig} from "../../flexi-modals.models";

export abstract class FlexiModalEvent {

  public abstract type: FlexiModalEventType;

  private _stopped = false;

  constructor(
    public config: IFlexiModalConfig<any>,
  ) {}

  public get stopped() {
    return this._stopped;
  }

  public stopPropagation(): void {
    this._stopped = true;
  }

  public get id(): string {
    return <string>this.config.id;
  }
}
