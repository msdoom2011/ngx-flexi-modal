import {FmModalPreventableEvent} from './abstract/fm-modal-preventable.event';
import {FmModalEventType} from '../flexi-modals.constants';
import {FmModal} from '../../../models/fm-modal';

export class FmModalBeforeCloseEvent<
  ModalT extends FmModal = FmModal
>
extends FmModalPreventableEvent<ModalT> {

  public readonly type = FmModalEventType.BeforeClose;
}
