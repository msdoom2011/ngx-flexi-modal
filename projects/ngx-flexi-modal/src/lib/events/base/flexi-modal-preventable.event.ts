import {FlexiModalEvent} from "./flexi-modal.event";
import {FlexiModal} from "../../modals/flexi-modal";

export abstract class FlexiModalPreventableEvent<
  ModalT extends FlexiModal
>
extends FlexiModalEvent<ModalT> {

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
