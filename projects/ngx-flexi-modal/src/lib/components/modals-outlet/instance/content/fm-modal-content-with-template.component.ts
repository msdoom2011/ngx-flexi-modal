import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';

import { FmModalWithTemplate } from '../../../../models/fm-modal-with-template';
import { FmModalInstanceContent } from './fm-modal-instance-content';

@Component({
  selector: 'fm-modal-content-with-template',
  templateUrl: './fm-modal-instance-content.html',
  styleUrl: './fm-modal-instance-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class FmModalContentWithTemplateComponent
extends FmModalInstanceContent<FmModalWithTemplate>
implements AfterViewInit {

  public ngAfterViewInit(): void {
    const modal = this.modal();
    const content$ = modal.content$;
    const embeddedViewRef = this._contentRef()?.createEmbeddedView(
      modal.content,
      modal.config().context || undefined,
    );

    content$.next(embeddedViewRef || null);
    content$.complete();
  }
}
