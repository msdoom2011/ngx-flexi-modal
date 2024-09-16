import {EmbeddedViewRef, TemplateRef} from "@angular/core";

import {IFlexiModalTemplateConfig, IFlexiModalTemplateOptions} from "../flexi-modals.models";
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
