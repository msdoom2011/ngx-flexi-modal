import {IFlexiModalBasicInputs, IFlexiModalBasicOptions} from "./flexi-modal-basic.definitions";
import {FlexiModalBasicComponent} from "./components/modal-basic/flexi-modal-basic.component";
import {IFlexiModalComponentOptions} from "../../services/modals/flexi-modals.definitions";
import {extendComponentModalOptions} from "../../tools/utils";

export function extendBasicModalOptions(
  basicOptions: IFlexiModalComponentOptions<FlexiModalBasicComponent, Partial<IFlexiModalBasicInputs>>,
  userOptions: IFlexiModalBasicOptions,
): IFlexiModalComponentOptions<FlexiModalBasicComponent, IFlexiModalBasicInputs> {

  return extendComponentModalOptions<FlexiModalBasicComponent, IFlexiModalBasicInputs>(
    basicOptions,
    userOptions,
    [
      'message',
      'messageAlign',
      'icon'
    ]
  );
}
