import {FlexiModalEventType} from "../../flexi-modals.constants";
import {FlexiModal} from "../../modals/flexi-modal";

export abstract class FlexiModalEvent<ModalT extends FlexiModal> {

  public abstract type: FlexiModalEventType;

  private _stopped = false;

  constructor(
    public modal: ModalT,
  ) {}

  public get stopped() {
    return this._stopped;
  }

  public stopPropagation(): void {
    this._stopped = true;
  }

  public get id(): string {
    return <string>this.modal.config.id;
  }
}
