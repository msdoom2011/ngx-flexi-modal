import {SurveyModalBasicComponent} from "./components/modal-basic/survey-modal-basic.component";
import {ISurveyModalBasicInputs, ISurveyModalBasicOptions} from "./survey-modal-basic.models";
import {ISurveyComponentModalCreateOptions} from "../../survey-modals.models";

export function extendModalOptions(
  basicOptions: ISurveyComponentModalCreateOptions<
    SurveyModalBasicComponent,
    Partial<ISurveyModalBasicInputs>
  >,
  userOptions: ISurveyModalBasicOptions,
): ISurveyComponentModalCreateOptions<
    SurveyModalBasicComponent,
    ISurveyModalBasicInputs
> {
  return <ISurveyComponentModalCreateOptions<
    SurveyModalBasicComponent,
    ISurveyModalBasicInputs>
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
