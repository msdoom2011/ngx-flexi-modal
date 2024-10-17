import { Component } from '@angular/core';

import { FmModalComponent } from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import { SimpleTextComponent } from '../../modal-content/simple-text/simple-text.component';
import { ModalWithTemplate } from '../modal-with-template';
import {
  FmModalBodyDirective
} from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/directives/fm-modal-body.directive';

@Component({
  selector: 'cy-modal-empty',
  template: `
    <fm-modal
      [opened]="opened()"
      [closable]="closable()"
      [maximizable]="maximizable()"
      [title]="title()"
      #modal
    >
      <cy-simple-text *fmModalBody />
    </fm-modal>
  `,
  standalone: true,
  imports: [
    FmModalComponent,
    SimpleTextComponent,
    FmModalBodyDirective,
  ],
})
export class ModalEmptyComponent extends ModalWithTemplate {}
