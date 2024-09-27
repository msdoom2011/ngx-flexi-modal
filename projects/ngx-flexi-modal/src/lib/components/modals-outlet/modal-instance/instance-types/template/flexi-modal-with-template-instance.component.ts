import {AfterViewInit, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalInstanceFooterComponent} from "../../instance-layout/footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceHeaderComponent} from "../../instance-layout/header/flexi-modal-instance-header.component";
import {FlexiModalInstanceLayoutComponent} from "../../instance-layout/flexi-modal-instance-layout.component";
import {FlexiModalWithTemplateHeaderComponent} from "./header/flexi-modal-with-template-header.component";
import {FlexiModalWithTemplateFooterComponent} from "./footer/flexi-modal-with-template-footer.component";
import {FlexiModalWithTemplate} from "../../../../../models/flexi-modal-with-template";
import {FlexiModalInstance} from "../../flexi-modal-instance";

@Component({
  selector: 'fm-modal-with-template-instance',
  templateUrl: './flexi-modal-with-template-instance.component.html',
  styleUrl: '../../flexi-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlexiModalInstanceLayoutComponent,
    FlexiModalInstanceHeaderComponent,
    FlexiModalInstanceFooterComponent,
    FlexiModalWithTemplateHeaderComponent,
    FlexiModalWithTemplateFooterComponent,
    NgTemplateOutlet,
  ]
})
export class FlexiModalWithTemplateInstanceComponent<ContentT extends object>
extends FlexiModalInstance<FlexiModalWithTemplate<ContentT>>
implements AfterViewInit {

  public readonly modal = input.required<FlexiModalWithTemplate<ContentT>>();

  public ngAfterViewInit() {
    const content$ = this.modal().content$;
    const embeddedViewRef = this._contentRef()?.createEmbeddedView<ContentT>(
      this.modal().content,
      this.modal().config().context || undefined,
      { injector: this._injector }
    );

    content$.next(embeddedViewRef || null);
    content$.complete();
  }
}
