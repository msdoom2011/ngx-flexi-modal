import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalContainerLayoutComponent} from "../../container-layout/flexi-modal-container-layout.component";
import {IFlexiTemplateModalConfig} from "../../../../../flexi-modals.models";
import {FlexiModalContainer} from "../../flexi-modal-container";

@Component({
  selector: 'fm-template-modal-container',
  templateUrl: './flexi-template-modal-container.component.html',
  styleUrl: '../../flexi-modal-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalContainerLayoutComponent,
    NgTemplateOutlet
  ]
})
export class FlexiTemplateModalContainerComponent<ContentT>
extends FlexiModalContainer<
  IFlexiTemplateModalConfig<ContentT>,
  ContentT
> {

  public override config = input.required<IFlexiTemplateModalConfig<ContentT>>();
}
