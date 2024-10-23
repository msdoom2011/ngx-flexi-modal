import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

export class FmModalMaximizeEvent<ModalT extends FmModal = FmModal> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.Maximize;

  public readonly maximized = true;
}
