import {Observable, tap} from "rxjs";

import {IFlexiModalActionConfig} from "../../services/modals/flexi-modals.definitions";
import {FlexiModal} from "../flexi-modal";

export class FlexiModalAction {

  constructor(
    public modal: FlexiModal,
    public config: IFlexiModalActionConfig,
  ) {}

  public get id(): string {
    return this.config.id || '';
  }

  public get index(): number {
    return this.modal.actions.getIndex(this.id);
  }

  public enable(label?: string): void {
    this.modal.actions.update(this.id, {
      ...(label ? { label: label } : {}),
      disabled: false,
    });
  }

  public disable(label?: string): void {
    this.modal.actions.update(this.id, {
      ...(label ? { label: label } : {}),
      disabled: true,
    });
  }

  public update(changes: Partial<IFlexiModalActionConfig>): Observable<FlexiModalAction> {
    return this.modal.actions.update(this.id, changes)
      .pipe(tap(action => this.config = action.unwrap()));
  }

  public remove(): void {
    this.modal.actions.removeById(this.id);
  }

  public replaceWith(actionConfig: IFlexiModalActionConfig): Observable<FlexiModalAction> {
    return this.modal.actions.replaceById(this.id, actionConfig);
  }

  public unwrap(): IFlexiModalActionConfig {
    return this.config;
  }
}
