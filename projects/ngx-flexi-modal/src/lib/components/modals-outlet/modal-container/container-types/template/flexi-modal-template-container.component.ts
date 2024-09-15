import {AfterViewInit, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalTemplateContainerHeaderComponent} from "./header/flexi-modal-template-container-header.component";
import {FlexiModalTemplateContainerFooterComponent} from "./footer/flexi-modal-template-container-footer.component";
import {FlexiModalLayoutFooterComponent} from "../../container-layout/footer/flexi-modal-layout-footer.component";
import {FlexiModalLayoutHeaderComponent} from "../../container-layout/header/flexi-modal-layout-header.component";
import {FlexiModalLayoutComponent} from "../../container-layout/flexi-modal-layout.component";
import {FlexiModalTemplate} from "../../../../../modals/flexi-modal-template";
import {FlexiModalContainer} from "../../flexi-modal-container";

@Component({
  selector: 'fm-modal-template-container',
  templateUrl: './flexi-modal-template-container.component.html',
  styleUrl: '../../flexi-modal-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalLayoutComponent,
    FlexiModalLayoutHeaderComponent,
    FlexiModalLayoutFooterComponent,
    FlexiModalTemplateContainerHeaderComponent,
    FlexiModalTemplateContainerFooterComponent,
    NgTemplateOutlet,
  ]
})
export class FlexiModalTemplateContainerComponent<ContentT extends object>
extends FlexiModalContainer<FlexiModalTemplate<ContentT>>
implements AfterViewInit {

  public override modal = input.required<FlexiModalTemplate<ContentT>>();

  public ngAfterViewInit() {
    const content$ = this.modal().content$;
    const embeddedViewRef = this.contentRef()?.createEmbeddedView<ContentT>(
      this.modal().content,
      this.modal().config.context || undefined,
      { injector: this._injector }
    );

    content$.next(embeddedViewRef || null);
    content$.complete();
  }
}
