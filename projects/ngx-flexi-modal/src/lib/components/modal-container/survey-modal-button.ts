import {Observable, tap} from "rxjs";

import {SurveyModalContainerComponent} from "./survey-modal-container.component";
import {ISurveyModalButtonConfig} from "../../survey-modals.models";

export class SurveyModalButton {

  constructor(
    public modal: SurveyModalContainerComponent<any, any>,
    public config: ISurveyModalButtonConfig,
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

  public update(changes: Partial<ISurveyModalButtonConfig>): Observable<SurveyModalButton> {
    return this.modal.buttons.update(this.id, changes)
      .pipe(
        tap(button => this.config = button.unwrap())
      );
  }

  public remove(): void {
    this.modal.buttons.removeById(this.id);
  }

  public replaceWith(buttonConfig: ISurveyModalButtonConfig): Observable<SurveyModalButton> {
    return this.modal.buttons.replaceById(this.id, buttonConfig);
  }

  public unwrap(): ISurveyModalButtonConfig {
    return this.config;
  }
}
