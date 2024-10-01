import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FmModalInstanceFooterComponent } from '../../instance-layout/footer/fm-modal-instance-footer.component';
import { FmModalInstanceHeaderComponent } from '../../instance-layout/header/fm-modal-instance-header.component';
import { FmModalInstanceLayoutComponent } from '../../instance-layout/fm-modal-instance-layout.component';
import { FmModalWithTemplateHeaderComponent } from './header/fm-modal-with-template-header.component';
import { FmModalWithTemplateFooterComponent } from './footer/fm-modal-with-template-footer.component';
import { FmModalWithTemplate } from '../../../../../models/fm-modal-with-template';
import { FM_MODAL_INSTANCE } from '../../fm-modal-instance.providers';
import { FmModalInstance } from '../../fm-modal-instance';

@Component({
  selector: 'fm-modal-with-template-instance',
  templateUrl: './fm-modal-with-template-instance.component.html',
  styleUrl: '../../fm-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FmModalInstanceLayoutComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceFooterComponent,
    FmModalWithTemplateHeaderComponent,
    FmModalWithTemplateFooterComponent,
    NgTemplateOutlet,
  ],
  providers: [
    { provide: FM_MODAL_INSTANCE, useExisting: FmModalWithTemplateInstanceComponent },
  ],
})
export class FmModalWithTemplateInstanceComponent<ContentT extends object>
extends FmModalInstance<FmModalWithTemplate<ContentT>>
implements AfterViewInit {

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
