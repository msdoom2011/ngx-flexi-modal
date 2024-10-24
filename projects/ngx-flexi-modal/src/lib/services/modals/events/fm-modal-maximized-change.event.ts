import {FmModalEventType} from '../flexi-modals.constants';
import {FmModalEvent} from './abstract/fm-modal.event';
import {FmModal} from '../../../models/fm-modal';

export class FmModalMaximizedChangeEvent<ModalT extends FmModal = FmModal> extends FmModalEvent<ModalT> {

  public readonly type = FmModalEventType.MaximizedChange;

  constructor(
    modal: ModalT,
    public maximized: boolean,
  ) {
    super(modal);
  }
}
