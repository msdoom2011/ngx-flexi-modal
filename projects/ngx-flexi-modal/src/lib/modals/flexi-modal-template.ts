import {EmbeddedViewRef, TemplateRef} from "@angular/core";

import {IFlexiTemplateModalCreateOptions} from "../flexi-modals.models";
import {FlexiModal} from "./flexi-modal";

export class FlexiModalTemplate<ContextT extends object = any>
extends FlexiModal<
  IFlexiTemplateModalCreateOptions<ContextT>,
  EmbeddedViewRef<ContextT>,
  TemplateRef<ContextT>
>{

  public readonly type = 'TEMPLATE';
}
