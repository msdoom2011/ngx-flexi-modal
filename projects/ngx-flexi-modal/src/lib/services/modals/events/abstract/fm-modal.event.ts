import {FmModalEventType} from '../../flexi-modals.constants';
import {FmModal} from '../../../../models/fm-modal';

export abstract class FmModalEvent<ModalT extends FmModal> {

  public abstract readonly type: FmModalEventType;

  private _stopped = false;

  constructor(
    public modal: ModalT,
  ) {}

  public get stopped() {
    return this._stopped;
  }

  public stopPropagation(): void {
    this._stopped = true;
  }

  public get id(): string {
    return <string>this.modal.config().id;
  }
}
