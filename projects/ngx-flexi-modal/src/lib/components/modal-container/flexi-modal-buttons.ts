import {filter, Observable, ReplaySubject, take} from "rxjs";

import {FlexiModalContainer} from "./flexi-modal-container";
import {FlexiModalUpdateEvent} from "../../events/flexi-modal-update.event";
import {IFlexiModalButtonConfig} from "../../flexi-modals.models";
import {FlexiModalEvent} from "../../events/flexi-modal.event";
import {FlexiModalsService} from "../../flexi-modals.service";
import {FlexiModalButton} from "./flexi-modal-button";

export class FlexiModalButtons {

  constructor(
    private modalService: FlexiModalsService,
    private modal: FlexiModalContainer<any, any>,
  ) {}


  // Getters

  public get configs(): Array<IFlexiModalButtonConfig> {
    return this.modal.config().buttons || [];
  }

  public get length(): number {
    return this.configs.length;
  }


  // Public methods

  public getById(buttonId: string): FlexiModalButton | undefined {
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
      Partial<IFlexiModalButtonConfig>
      | ((buttonConfig: IFlexiModalButtonConfig) => IFlexiModalButtonConfig)
    )
  ): Observable<FlexiModalButton> {

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
    buttonConfig: IFlexiModalButtonConfig
  ): Observable<FlexiModalButton> {

    return this.replaceByIndex(this.getIndex(buttonId), buttonConfig);
  }

  public replaceByIndex(
    buttonIndex: number,
    buttonConfig: IFlexiModalButtonConfig
  ): Observable<FlexiModalButton> {

    const buttonConfigs = [...this.configs];
    const newButtonConfig$ = new ReplaySubject<FlexiModalButton>(1);

    buttonConfigs[buttonIndex] = buttonConfig;

    this.modalService.events$
      .pipe(
        filter(($event: FlexiModalUpdateEvent | FlexiModalEvent) => (
          $event instanceof FlexiModalUpdateEvent
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

  public replaceAll(buttonConfigs: Array<IFlexiModalButtonConfig>): void {
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

  public wrap(buttonConfig: IFlexiModalButtonConfig): FlexiModalButton {
    return new FlexiModalButton(this.modal, buttonConfig);
  }
}
