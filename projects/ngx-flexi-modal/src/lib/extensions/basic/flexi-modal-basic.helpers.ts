import {FlexiModalBasicComponent} from "./components/modal-basic/flexi-modal-basic.component";
import {IFlexiModalBasicInputs, IFlexiModalBasicOptions} from "./flexi-modal-basic.models";
import {IFlexiComponentModalCreateOptions} from "../../flexi-modals.models";

export function extendModalOptions(
  basicOptions: IFlexiComponentModalCreateOptions<
    FlexiModalBasicComponent,
    Partial<IFlexiModalBasicInputs>
  >,
  userOptions: IFlexiModalBasicOptions,
): IFlexiComponentModalCreateOptions<
    FlexiModalBasicComponent,
    IFlexiModalBasicInputs
> {
  return <IFlexiComponentModalCreateOptions<
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
    ...('aliveUntil' in userOptions ? { onClose: userOptions.aliveUntil } : {}),
    ...(userOptions.onClose ? { onClose: userOptions.onClose } : {}),
  };
}
