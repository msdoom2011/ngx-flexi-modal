import {SurveyModalContainerComponent} from "../components/modal-container/survey-modal-container.component";
import {ISurveyModalConfig, ISurveyModalCreateOptions} from "../survey-modals.models";
import {SurveyModalEventType} from "../survey-modals.constants";

export class SurveyModalUpdateEvent {

  public readonly type = SurveyModalEventType.Update;

  constructor(
    public config: ISurveyModalConfig<any>,
    public modal: SurveyModalContainerComponent<any, any>,
    public changes: Partial<ISurveyModalCreateOptions<any>>,
  ) {}

  public get id(): string {
    return <string>this.config.id;
  }
}
