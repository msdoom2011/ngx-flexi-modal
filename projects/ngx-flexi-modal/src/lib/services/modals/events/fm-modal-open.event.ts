import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

export class FmModalOpenEvent<
  ModalT extends FmModal = FmModal
> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.Open;
}
