import {filter, Observable, ReplaySubject, take} from "rxjs";

import {FlexiModalUpdateEvent} from "../../services/modals/events/flexi-modal-update.event";
import {IFlexiModalActionConfig} from "../../services/modals/flexi-modals.definitions";
import {FlexiModalsService} from "../../services/modals/flexi-modals.service";
import {FlexiModalAction} from "./flexi-modal-action";
import {FlexiModal} from "../flexi-modal";

export class FlexiModalActions<ModalT extends FlexiModal<any, any, any>> {

  constructor(
    private _service: FlexiModalsService,
    private _modal: ModalT,
  ) {}


  // Getters

  public get configs(): Array<IFlexiModalActionConfig> {
    return this._modal.config.actions || [];
  }

  public get length(): number {
    return this.configs.length;
  }


  // Public methods

  public getById(actionId: string): FlexiModalAction | undefined {
    const actionConfig = this.configs.find(actionConf => actionConf.id === actionId);

    if (!actionConfig) {
      return;
    }

    return this.wrap(actionConfig);
  }

  public getIndex(actionId: string): number {
    return this.configs.findIndex(actionConfig => actionConfig.id === actionId);
  }

  public update(
    actionId: string,
    changes: (
      Partial<IFlexiModalActionConfig>
      | ((actionConfig: IFlexiModalActionConfig) => IFlexiModalActionConfig)
    )
  ): Observable<FlexiModalAction> {

    if (!changes) {
      throw new Error('Specified invalid modal changes object: ' + changes);
    }

    const actionConfig = this.getById(actionId)?.unwrap();

    if (!actionConfig) {
      throw new Error(`Trying to update modal action with non existent id "${actionId}"`);
    }

    return this.replaceById(
      actionId,
      typeof changes === 'function'
        ? { ...actionConfig, ...changes({ ...actionConfig }) }
        : { ...actionConfig, ...changes }
    );
  }

  public replaceById(
    actionId: string,
    actionConfig: IFlexiModalActionConfig
  ): Observable<FlexiModalAction> {

    return this.replaceByIndex(this.getIndex(actionId), actionConfig);
  }

  public replaceByIndex(
    actionIndex: number,
    actionConfig: IFlexiModalActionConfig
  ): Observable<FlexiModalAction> {

    const actionConfigs = [...this.configs];
    const newActionConfig$ = new ReplaySubject<FlexiModalAction>(1);

    actionConfigs[actionIndex] = actionConfig;

    this._service.events$
      .pipe(
        filter($event => (
          $event instanceof FlexiModalUpdateEvent
          && this._modal.id === $event.id
          && Object.keys($event.changes).length === 1
          && Object.keys($event.changes)[0] === 'actions'
        )),
        take(1)
      )
      .subscribe(() => {
        newActionConfig$.next(this.wrap(this.configs[actionIndex]));
        newActionConfig$.complete();
      });

    this._service.updateModal(this._modal.id, { actions: actionConfigs });

    return newActionConfig$.asObservable();
  }

  public replaceAll(actionConfigs: Array<IFlexiModalActionConfig>): void {
    this._service.updateModal(this._modal.id, { actions: actionConfigs });
  }

  public removeById(actionId: string): void {
    const actionIndex = this.getIndex(actionId);

    this.removeByIndex(actionIndex);
  }

  public removeByIndex(actionIndex: number): void {
    const actionConfigs = [...this.configs];

    actionConfigs.splice(actionIndex, 1);

    this._service.updateModal(this._modal.id, { actions: actionConfigs });
  }

  public wrap(actionConfig: IFlexiModalActionConfig): FlexiModalAction {
    return new FlexiModalAction(this._modal, actionConfig);
  }
}
