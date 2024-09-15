import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgComponentOutlet} from "@angular/common";

import {FlexiModalContainerLayoutComponent} from "../../container-layout/flexi-modal-container-layout.component";
import {IFlexiComponentModalConfig} from "../../../../../flexi-modals.models";
import {FlexiModalContainer} from "../../flexi-modal-container";

@Component({
  selector: 'fm-component-modal-container',
  templateUrl: './flexi-component-modal-container.component.html',
  styleUrl: '../../flexi-modal-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalContainerLayoutComponent,
    NgComponentOutlet,
  ],
})
export class FlexiComponentModalContainerComponent<ContentT>
extends FlexiModalContainer<
  IFlexiComponentModalConfig<ContentT>,
  ContentT
> {

  public override config = input.required<IFlexiComponentModalConfig<ContentT>>();
}
