import {Observable, tap} from "rxjs";

import {FlexiModalContainer} from "./flexi-modal-container";
import {IFlexiModalButtonConfig} from "../../flexi-modals.models";

export class FlexiModalButton {

  constructor(
    public modal: FlexiModalContainer<any, any>,
    public config: IFlexiModalButtonConfig,
  ) {}

  public get id(): string {
    return this.config.id || '';
  }

  public get index(): number {
    return this.modal.buttons.getIndex(this.id);
  }

  public enable(label?: string): void {
    this.modal.buttons.update(this.id, {
      ...(label ? { label: label } : {}),
      disabled: false,
    });
  }

  public disable(label?: string): void {
    this.modal.buttons.update(this.id, {
      ...(label ? { label: label } : {}),
      disabled: true,
    });
  }

  public update(changes: Partial<IFlexiModalButtonConfig>): Observable<FlexiModalButton> {
    return this.modal.buttons.update(this.id, changes)
      .pipe(
        tap(button => this.config = button.unwrap())
      );
  }

  public remove(): void {
    this.modal.buttons.removeById(this.id);
  }

  public replaceWith(buttonConfig: IFlexiModalButtonConfig): Observable<FlexiModalButton> {
    return this.modal.buttons.replaceById(this.id, buttonConfig);
  }

  public unwrap(): IFlexiModalButtonConfig {
    return this.config;
  }
}
