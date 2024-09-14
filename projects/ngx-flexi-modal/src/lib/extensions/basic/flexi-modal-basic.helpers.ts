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
      ...(userOptions.message ? { message: userOptions.message } : {}),
      ...(userOptions.messageAlign ? { messageAlign: userOptions.messageAlign } : {}),
      ...(userOptions.icon ? { icon: userOptions.icon } : {}),
    },
    ...(userOptions.title ? { title: userOptions.title } : {}),
    ...(userOptions.onClose ? { onClose: userOptions.onClose } : {}),
    ...(userOptions.aliveUntil ? { onClose: userOptions.aliveUntil } : {}),
  };
}
