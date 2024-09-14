import {filter, Observable, ReplaySubject, take} from "rxjs";

import {SurveyModalContainerComponent} from "./survey-modal-container.component";
import {SurveyModalUpdateEvent} from "../../events/survey-modal-update.event";
import {ISurveyModalButtonConfig} from "../../survey-modals.models";
import {SurveyModalEvent} from "../../events/survey-modal.event";
import {SurveyModalsService} from "../../survey-modals.service";
import {SurveyModalButton} from "./survey-modal-button";

export class SurveyModalButtons {

  constructor(
    private modalService: SurveyModalsService,
    private modal: SurveyModalContainerComponent<any, any>,
  ) {}


  // Getters

  public get configs(): Array<ISurveyModalButtonConfig> {
    return this.modal.config().buttons || [];
  }

  public get length(): number {
    return this.configs.length;
  }


  // Public methods

  public getById(buttonId: string): SurveyModalButton | undefined {
    const buttonConfig = this.configs.find(buttonConfig => buttonConfig.id === buttonId);

    if (!buttonConfig) {
      return;
    }

    return this.wrap(buttonConfig);
  }

  public getIndex(buttonId: string): number {
    return this.configs.findIndex(buttonConfig => buttonConfig.id === buttonId);
  }

  public update(
    buttonId: string,
    changes: (
      Partial<ISurveyModalButtonConfig>
      | ((buttonConfig: ISurveyModalButtonConfig) => ISurveyModalButtonConfig)
    )
  ): Observable<SurveyModalButton> {

    if (!changes) {
      throw new Error('Specified invalid modal changes object: ' + changes);
    }

    const buttonConfig = this.getById(buttonId)?.unwrap();

    if (!buttonConfig) {
      throw new Error(`Trying to update modal with non existent id "${buttonId}"`);
    }

    return this.replaceById(
      buttonId,
      typeof changes === 'function'
        ? { ...buttonConfig, ...changes({ ...buttonConfig }) }
        : { ...buttonConfig, ...changes }
    );
  }

  public replaceById(
    buttonId: string,
    buttonConfig: ISurveyModalButtonConfig
  ): Observable<SurveyModalButton> {

    return this.replaceByIndex(this.getIndex(buttonId), buttonConfig);
  }

  public replaceByIndex(
    buttonIndex: number,
    buttonConfig: ISurveyModalButtonConfig
  ): Observable<SurveyModalButton> {

    const buttonConfigs = [...this.configs];
    const newButtonConfig$ = new ReplaySubject<SurveyModalButton>(1);

    buttonConfigs[buttonIndex] = buttonConfig;

    this.modalService.events$
      .pipe(
        filter(($event: SurveyModalUpdateEvent | SurveyModalEvent) => (
          $event instanceof SurveyModalUpdateEvent
          && Object.keys($event.changes).length === 1
          && Object.keys($event.changes)[0] === 'buttons'
        )),
        take(1)
      )
      .subscribe(() => {
        newButtonConfig$.next(this.wrap(this.configs[buttonIndex]));
        newButtonConfig$.complete();
      });

    this.modalService.updateModal(this.modal.id(), { buttons: buttonConfigs });

    return newButtonConfig$.asObservable();
  }

  public replaceAll(buttonConfigs: Array<ISurveyModalButtonConfig>): void {
    this.modalService.updateModal(this.modal.id(), { buttons: buttonConfigs });
  }

  public removeById(buttonId: string): void {
    const buttonIndex = this.getIndex(buttonId);

    this.removeByIndex(buttonIndex);
  }

  public removeByIndex(buttonIndex: number): void {
    const buttonConfigs = [...this.configs];

    buttonConfigs.splice(buttonIndex, 1);

    this.modalService.updateModal(this.modal.id(), { buttons: buttonConfigs });
  }

  public wrap(buttonConfig: ISurveyModalButtonConfig): SurveyModalButton {
    return new SurveyModalButton(this.modal, buttonConfig);
  }
}
