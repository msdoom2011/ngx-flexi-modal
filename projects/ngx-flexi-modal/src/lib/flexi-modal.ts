import {FlexiModalContainer} from "./components/modals-outlet/modal-container/flexi-modal-container";
import {FlexiModalType} from "./flexi-modals.constants";

export class FlexiModal<ModalContainerT extends FlexiModalContainer<any, any>> {

  constructor(
    public type: FlexiModalType,
  ) {}
}
