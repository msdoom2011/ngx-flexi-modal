import {FlexiModalContainer} from "../components/modal-container/flexi-modal-container";
import {FlexiModalEvent} from "./flexi-modal.event";

export class FlexiModalBeforeEvent<
  ContainerT extends FlexiModalContainer<any, any> = FlexiModalContainer<any, any>
> extends FlexiModalEvent<ContainerT> {

  private _prevented = false;

  public get prevented() {
    return this._prevented;
  }

  public preventDefault(): void {
    this._prevented = true;
  }

  public allowDefault(): void {
    this._prevented = false;
  }
}
