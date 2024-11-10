import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { FmModalComponent } from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import { ManyTextComponent } from '../../modal-content/many-text.component';
import { ModalWithTemplate } from '../modal-with-template';
import {
  FmModalBodyDirective
} from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/directives/fm-modal-body.directive';
import {
  FmModalActionDirective
} from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/directives/fm-modal-action.directive';
import {
  FmModalHeaderDirective
} from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/directives/fm-modal-header.directive';

@Component({
  selector: 'cy-modal-many-text',
  template: `
    <fm-modal
      [id]="id()"
      [opened]="opened()"
      [spinner]="spinner()"
      [maximizable]="maximizable()"
      [animation]="animation()"
      [closable]="closable()"
      [scroll]="scroll()"
      #modal
    >
      <h3 *fmModalHeader class="fm-modal-header" data-cy="modal-title">
        Modal Title
      </h3>

      <cy-many-text *fmModalBody />

      <button
        class="fm-modal-action-button primary"
        *fmModalAction
        (click)="modal.close()"
      >Confirm</button>

      <button
        class="fm-modal-action-button"
        *fmModalAction
        (click)="modal.close()"
      >Cancel</button>
    </fm-modal>
  `,
  standalone: true,
  imports: [
    FmModalComponent,
    FmModalBodyDirective,
    FmModalActionDirective,
    NgTemplateOutlet,
    FmModalHeaderDirective,
    ManyTextComponent,
  ],
})
export class ModalManyTextComponent extends ModalWithTemplate {}
