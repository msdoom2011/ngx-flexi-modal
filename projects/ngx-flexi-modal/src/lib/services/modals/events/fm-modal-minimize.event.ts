import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

export class FmModalMinimizeEvent<ModalT extends FmModal = FmModal> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.Minimize;

  public readonly maximized = false;
}
