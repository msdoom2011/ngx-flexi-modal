import {SurveyModalContainerComponent} from "../components/modal-container/survey-modal-container.component";
import {ISurveyModalConfig, ISurveyModalCreateOptions} from "../survey-modals.models";
import {SurveyModalEventType} from "../survey-modals.constants";

export class SurveyModalEvent {

  constructor(
    public type: SurveyModalEventType,
    public config: ISurveyModalConfig<any>,
    public modal?: SurveyModalContainerComponent<any, any>,
  ) {}

  public get id(): string {
    return <string>this.config.id;
  }
}
