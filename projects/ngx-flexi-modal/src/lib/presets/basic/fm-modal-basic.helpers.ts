import {IFmModalWithComponentOptions} from '../../services/modals/flexi-modals.definitions';
import {FmModalBasicComponent} from './components/modal-basic/fm-modal-basic.component';
import {IFmModalBasicInputs, IFmModalBasicOptions} from './fm-modal-basic.definitions';
import {extendModalOptionsWithInputs} from '../../tools/utils';

export function extendBasicModalOptions(
  baseOptions: IFmModalWithComponentOptions<FmModalBasicComponent, Partial<IFmModalBasicInputs>>,
  userOptionsOrMessage: IFmModalBasicOptions | string,
): IFmModalWithComponentOptions<FmModalBasicComponent, IFmModalBasicInputs> {

  const userOptions = typeof userOptionsOrMessage === 'string'
    ? { message: userOptionsOrMessage }
    : userOptionsOrMessage;

  return extendModalOptionsWithInputs<FmModalBasicComponent, IFmModalBasicInputs>(
    baseOptions,
    userOptions,
    [
      'message',
      'messageAlign',
      'icon'
    ]
  );
}
