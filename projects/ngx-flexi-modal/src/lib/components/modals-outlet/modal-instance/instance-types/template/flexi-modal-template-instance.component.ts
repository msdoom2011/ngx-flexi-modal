import {AfterViewInit, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalTemplateHeaderComponent} from "./header/flexi-modal-template-header.component";
import {FlexiModalTemplateFooterComponent} from "./footer/flexi-modal-template-footer.component";
import {FlexiModalInstanceFooterComponent} from "../../instance-layout/footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceHeaderComponent} from "../../instance-layout/header/flexi-modal-instance-header.component";
import {FlexiModalInstanceLayoutComponent} from "../../instance-layout/flexi-modal-instance-layout.component";
import {FlexiModalWithTemplate} from "../../../../../models/flexi-modal-with-template";
import {FlexiModalInstance} from "../../flexi-modal-instance";

@Component({
  selector: 'fm-modal-template-instance',
  templateUrl: './flexi-modal-template-instance.component.html',
  styleUrl: '../../flexi-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalInstanceLayoutComponent,
    FlexiModalInstanceHeaderComponent,
    FlexiModalInstanceFooterComponent,
    FlexiModalTemplateHeaderComponent,
    FlexiModalTemplateFooterComponent,
    NgTemplateOutlet,
  ]
})
export class FlexiModalTemplateInstanceComponent<ContentT extends object>
extends FlexiModalInstance<FlexiModalWithTemplate<ContentT>>
implements AfterViewInit {

  public override modal = input.required<FlexiModalWithTemplate<ContentT>>();

  public ngAfterViewInit() {
    const content$ = this.modal().content$;
    const embeddedViewRef = this.contentRef()?.createEmbeddedView<ContentT>(
      this.modal().content,
      this.modal().config().context || undefined,
      { injector: this._injector }
    );

    content$.next(embeddedViewRef || null);
    content$.complete();
  }
}
