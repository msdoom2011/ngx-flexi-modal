import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

/**
 * Triggers after the modal's redner and finishing of its opening animation
 */
export class FmModalReadyEvent<ModalT extends FmModal = FmModal> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.Ready;

  constructor(
    modal: ModalT,
    public ready: boolean,
  ) {
    super(modal);
  }
}
