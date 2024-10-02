import {Component} from '@angular/core';
import {
  FmModalActionTplDirective,
  FmModalHeaderTplDirective,
  FmModalSpinnerTplDirective,
  FmModalsOutletComponent
} from 'ngx-flexi-modal';

import {ShowcaseComponent} from './components/showcase/showcase.component';

@Component({
  selector: 'fm-app-root',
  standalone: true,
  imports: [
    FmModalsOutletComponent,
    FmModalActionTplDirective,
    FmModalHeaderTplDirective,
    FmModalSpinnerTplDirective,
    ShowcaseComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
