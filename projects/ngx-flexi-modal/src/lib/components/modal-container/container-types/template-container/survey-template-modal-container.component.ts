import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {SurveyModalContainerLayoutComponent} from "../../container-layout/survey-modal-container-layout.component";
import {SurveyModalContainerComponent} from "../../survey-modal-container.component";
import {ISurveyTemplateModalConfig} from "../../../../survey-modals.models";

@Component({
  selector: 'sw-template-modal-container',
  templateUrl: './survey-template-modal-container.component.html',
  styleUrl: '../../survey-modal-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SurveyModalContainerLayoutComponent,
    NgTemplateOutlet
  ]
})
export class SurveyTemplateModalContainerComponent<ContentT>
extends SurveyModalContainerComponent<
  ISurveyTemplateModalConfig<ContentT>,
  ContentT
> {
  public override config = input.required<ISurveyTemplateModalConfig<ContentT>>();
}
