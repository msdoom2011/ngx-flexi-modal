import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

export class FmModalActiveChangeEvent<ModalT extends FmModal = FmModal> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.ActiveChange;

  constructor(
    modal: ModalT,
    public active: boolean,
  ) {
    super(modal);
  }
}
