import {FlexiModalEvent} from "./flexi-modal.event";

export abstract class FlexiModalPreventableEvent extends FlexiModalEvent {

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
