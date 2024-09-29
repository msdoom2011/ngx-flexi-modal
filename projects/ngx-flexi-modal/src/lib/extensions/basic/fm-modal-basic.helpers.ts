import {IFmModalBasicInputs, IFmModalBasicOptions} from "./fm-modal-basic.definitions";
import {FmModalBasicComponent} from "./components/modal-basic/fm-modal-basic.component";
import {IFmModalWithComponentOptions} from "../../services/modals/flexi-modals.definitions";
import {extendModalWithComponentOptions} from "../../tools/utils";

export function extendBasicModalOptions(
  basicOptions: IFmModalWithComponentOptions<FmModalBasicComponent, Partial<IFmModalBasicInputs>>,
  userOptions: IFmModalBasicOptions,
): IFmModalWithComponentOptions<FmModalBasicComponent, IFmModalBasicInputs> {

  return extendModalWithComponentOptions<FmModalBasicComponent, IFmModalBasicInputs>(
    basicOptions,
    userOptions,
    [
      'message',
      'messageAlign',
      'icon'
    ]
  );
}
