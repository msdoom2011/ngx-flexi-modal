import {TemplateRef} from "@angular/core";

import {IFlexiTemplateModalCreateOptions} from "../flexi-modals.models";
import {FlexiModal} from "./flexi-modal";
import {
  FlexiTemplateModalContainerComponent
} from "../components/modals-outlet/modal-container/container-types/template/flexi-template-modal-container.component";

export class FlexiModalTemplate<ContextT extends object = any>
extends FlexiModal<
  IFlexiTemplateModalCreateOptions<ContextT>,
  FlexiTemplateModalContainerComponent<ContextT>,
  TemplateRef<ContextT>
>{

  public readonly type = 'TEMPLATE';
}
