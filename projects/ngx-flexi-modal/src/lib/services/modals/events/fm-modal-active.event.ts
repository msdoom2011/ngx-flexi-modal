import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

export class FmModalActiveEvent<ModalT extends FmModal = FmModal> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.Active;

  constructor(
    modal: ModalT,
    public active: boolean,
  ) {
    super(modal);
  }
}
