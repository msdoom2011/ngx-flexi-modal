import {Component} from '@angular/core';
import {
  FmModalActionTplDirective,
  FmModalHeaderTplDirective,
  FmModalFooterTplDirective,
  FmModalSpinnerTplDirective,
  FmModalsOutletComponent
} from 'ngx-flexi-modal';

import {ShowcaseComponent} from './components/showcase/showcase.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'fm-app-root',
  standalone: true,
  imports: [
    FmModalsOutletComponent,
    FmModalActionTplDirective,
    FmModalHeaderTplDirective,
    FmModalFooterTplDirective,
    FmModalSpinnerTplDirective,
    ShowcaseComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
