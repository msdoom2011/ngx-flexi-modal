import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalTemplateContainerHeaderComponent} from "./header/flexi-modal-template-container-header.component";
import {FlexiModalTemplateContainerFooterComponent} from "./footer/flexi-modal-template-container-footer.component";
import {FlexiModalContainerLayoutComponent} from "../../container-layout/flexi-modal-container-layout.component";
import {FlexiModalTemplate} from "../../../../../modals/flexi-modal-template";
import {FlexiModalContainer} from "../../flexi-modal-container";
import {
  FlexiModalContainerFooterComponent
} from "../../container-layout/container-footer/flexi-modal-container-footer.component";
import {
  FlexiModalContainerHeaderComponent
} from "../../container-layout/container-header/flexi-modal-container-header.component";

@Component({
  selector: 'fm-template-modal-container',
  templateUrl: './flexi-template-modal-container.component.html',
  styleUrl: '../../flexi-modal-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalContainerLayoutComponent,
    FlexiModalContainerHeaderComponent,
    FlexiModalContainerFooterComponent,
    FlexiModalTemplateContainerHeaderComponent,
    FlexiModalTemplateContainerFooterComponent,
    NgTemplateOutlet,
  ]
})
export class FlexiTemplateModalContainerComponent<ContentT extends object>
extends FlexiModalContainer<
  // IFlexiTemplateModalConfig<ContentT>,
  FlexiModalTemplate<ContentT>,
  ContentT
> {

  // public override config = input.required<IFlexiTemplateModalConfig<ContentT>>();
  public override modal = input.required<FlexiModalTemplate<ContentT>>();
}
