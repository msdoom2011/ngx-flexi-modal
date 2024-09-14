import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {SurveyModalContainerLayoutComponent} from "../../container-layout/survey-modal-container-layout.component";
import {SurveyModalContainerComponent} from "../../survey-modal-container.component";
import {ISurveyComponentModalConfig} from "../../../../survey-modals.models";

@Component({
  selector: 'sw-component-modal-container',
  templateUrl: './survey-component-modal-container.component.html',
  styleUrl: '../../survey-modal-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SurveyModalContainerLayoutComponent,
    NgComponentOutlet,
  ],
})
export class SurveyComponentModalContainerComponent<ContentT>
extends SurveyModalContainerComponent<
  ISurveyComponentModalConfig<ContentT>,
  ContentT
> {
  public override config = input.required<ISurveyComponentModalConfig<ContentT>>();
}
