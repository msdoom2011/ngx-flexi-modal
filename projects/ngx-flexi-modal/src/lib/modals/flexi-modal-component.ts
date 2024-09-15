import {Type} from "@angular/core";

import {IFlexiComponentModalCreateOptions} from "../flexi-modals.models";
import {FlexiModal} from "./flexi-modal";
import {
  FlexiComponentModalContainerComponent
} from "../components/modals-outlet/modal-container/container-types/component/flexi-component-modal-container.component";

export class FlexiModalComponent<
  ComponentT = any,
  InputsT extends object = Record<string, any>
>
extends FlexiModal<
  IFlexiComponentModalCreateOptions<ComponentT, InputsT>,
  FlexiComponentModalContainerComponent<ComponentT>,
  Type<ComponentT>
>{

  public readonly type = 'COMPONENT';
}
