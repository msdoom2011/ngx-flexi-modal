import {FmModal} from '../../../../models/fm-modal';
import {FmModalEvent} from './fm-modal.event';

export abstract class FmModalPreventableEvent<
  ModalT extends FmModal
>
extends FmModalEvent<ModalT> {

  private _prevented = false;

  public get prevented() {
    return this._prevented;
  }

  public preventDefault(): void {
    this._prevented = true;
  }

  public allowDefault(): void {
    this._prevented = false;
  }
}
