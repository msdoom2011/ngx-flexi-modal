import {IFmModalOptions} from "../flexi-modals.definitions";
import {FmModalEventType} from "../flexi-modals.constants";
import {FmModalEvent} from "./abstract/fm-modal.event";
import {FmModal} from "../../../models/fm-modal";

export class FmModalUpdateEvent<
  ModalT extends FmModal = FmModal,
  OptionsT extends IFmModalOptions<any> = IFmModalOptions<any>
>
extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.Update;

  constructor(
    modal: ModalT,
    public changes: OptionsT,
  ) {
    super(modal);
  }
}
