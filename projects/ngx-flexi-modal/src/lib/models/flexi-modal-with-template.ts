import {EmbeddedViewRef, TemplateRef} from "@angular/core";

import {IFlexiModalTemplateConfig, IFlexiModalTemplateOptions} from "../services/modals/flexi-modals.definitions";
import {MODAL_WITH_TEMPLATE_TYPE} from "../services/modals/flexi-modals.constants";
import {FlexiModal} from "./flexi-modal";

export class FlexiModalWithTemplate<ContextT extends object = any>
extends FlexiModal<
  IFlexiModalTemplateConfig<ContextT>,
  IFlexiModalTemplateOptions<ContextT>,
  EmbeddedViewRef<ContextT>,
  TemplateRef<ContextT>
>{

  public readonly type = MODAL_WITH_TEMPLATE_TYPE;
}
