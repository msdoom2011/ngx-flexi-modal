import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { FmModalComponent } from '../../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import { SimpleTextComponent } from '../../modal-content/simple-text/simple-text.component';
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
  selector: 'cy-modal-simple-text',
  templateUrl: './modal-simple-text.component.html',
  styleUrl: './modal-simple-text.component.scss',
  standalone: true,
  imports: [
    FmModalComponent,
    SimpleTextComponent,
    FmModalBodyDirective,
    FmModalActionDirective,
    NgTemplateOutlet,
    FmModalHeaderDirective,
  ],
})
export class ModalSimpleTextComponent extends ModalWithTemplate {}
