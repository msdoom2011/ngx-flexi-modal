import {IFlexiModalBasicInputs, IFlexiModalBasicOptions} from "./flexi-modal-basic.definitions";
import {FlexiModalBasicComponent} from "./components/modal-basic/flexi-modal-basic.component";
import {IFlexiModalComponentOptions} from "../../services/modals/flexi-modals.definitions";

export function extendModalOptions(
  basicOptions: IFlexiModalComponentOptions<
    FlexiModalBasicComponent,
    Partial<IFlexiModalBasicInputs>
  >,
  userOptions: IFlexiModalBasicOptions,
): IFlexiModalComponentOptions<
    FlexiModalBasicComponent,
    IFlexiModalBasicInputs
> {
  return <IFlexiModalComponentOptions<
    FlexiModalBasicComponent,
    IFlexiModalBasicInputs>
  >{
    ...basicOptions,
    inputs: {
      ...(basicOptions.inputs || {}),
      ...('message' in userOptions ? { message: userOptions.message } : {}),
      ...('messageAlign' in userOptions ? { messageAlign: userOptions.messageAlign } : {}),
      ...('icon' in userOptions ? { icon: userOptions.icon } : {}),
    },
    ...('title' in userOptions ? { title: userOptions.title } : {}),
    ...('theme' in userOptions ? { theme: userOptions.theme } : {}),
    ...('aliveUntil' in userOptions ? { aliveUntil: userOptions.aliveUntil } : {}),
    ...(userOptions.onClose ? { onClose: userOptions.onClose } : {}),
  };
}
