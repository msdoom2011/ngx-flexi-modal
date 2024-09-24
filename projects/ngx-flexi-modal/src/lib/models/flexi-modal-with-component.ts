import {ComponentRef, Type} from "@angular/core";

import {IFlexiModalComponentConfig, IFlexiModalComponentOptions} from "../services/modals/flexi-modals.definitions";
import {FlexiModal} from "./flexi-modal";

export class FlexiModalWithComponent<
  ComponentT = any,
  InputsT extends object = Record<string, any>
>
extends FlexiModal<
  IFlexiModalComponentConfig<ComponentT, InputsT>,
  IFlexiModalComponentOptions<ComponentT, InputsT>,
  ComponentRef<ComponentT>,
  Type<ComponentT>
>{

  public readonly type = 'COMPONENT';
}
