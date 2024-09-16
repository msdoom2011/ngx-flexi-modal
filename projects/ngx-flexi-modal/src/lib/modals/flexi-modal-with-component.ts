import {ComponentRef, Type} from "@angular/core";

import {IFlexiComponentModalCreateOptions} from "../flexi-modals.models";
import {FlexiModal} from "./flexi-modal";

export class FlexiModalWithComponent<
  ComponentT = any,
  InputsT extends object = Record<string, any>
>
extends FlexiModal<
  IFlexiComponentModalCreateOptions<ComponentT, InputsT>,
  ComponentRef<ComponentT>,
  Type<ComponentT>
>{

  public readonly type = 'COMPONENT';
}
