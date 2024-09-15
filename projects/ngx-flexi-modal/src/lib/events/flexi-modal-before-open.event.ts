import {FlexiModalPreventableEvent} from "./base/flexi-modal-preventable.event";
import {FlexiModalEventType} from "../flexi-modals.constants";

export class FlexiModalBeforeOpenEvent extends FlexiModalPreventableEvent {

  public type = FlexiModalEventType.BeforeOpen;
}
