import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {FlexiModalComponentContainerHeaderComponent} from "./header/flexi-modal-component-container-header.component";
import {FlexiModalComponentContainerFooterComponent} from "./footer/flexi-modal-component-container-footer.component";
import {FlexiModalContainerLayoutComponent} from "../../container-layout/flexi-modal-container-layout.component";
import {FlexiModalComponent} from "../../../../../modals/flexi-modal-component";
import {FlexiModalContainer} from "../../flexi-modal-container";
import {
  FlexiModalContainerHeaderComponent
} from "../../container-layout/container-header/flexi-modal-container-header.component";
import {
  FlexiModalContainerFooterComponent
} from "../../container-layout/container-footer/flexi-modal-container-footer.component";

@Component({
  selector: 'fm-component-modal-container',
  templateUrl: './flexi-component-modal-container.component.html',
  styleUrl: '../../flexi-modal-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalContainerLayoutComponent,
    FlexiModalContainerHeaderComponent,
    FlexiModalContainerFooterComponent,
    FlexiModalComponentContainerHeaderComponent,
    FlexiModalComponentContainerFooterComponent,
    NgComponentOutlet,
  ],
})
export class FlexiComponentModalContainerComponent<ComponentT>
extends FlexiModalContainer<
  FlexiModalComponent<ComponentT, any>,
  ComponentT
> {

  public override modal = input.required<FlexiModalComponent<ComponentT>>();
}
