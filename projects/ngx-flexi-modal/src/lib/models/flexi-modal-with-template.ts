import {EmbeddedViewRef, TemplateRef} from "@angular/core";

import {IFlexiModalTemplateConfig, IFlexiModalTemplateOptions} from "../services/modals/flexi-modals.definitions";
import {FlexiModal} from "./flexi-modal";

export class FlexiModalWithTemplate<ContextT extends object = any>
extends FlexiModal<
  IFlexiModalTemplateConfig<ContextT>,
  IFlexiModalTemplateOptions<ContextT>,
  EmbeddedViewRef<ContextT>,
  TemplateRef<ContextT>
>{

  public readonly type = 'TEMPLATE';
}
