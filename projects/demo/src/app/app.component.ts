import {Component} from '@angular/core';
import {
  FlexiModalActionTplDirective,
  FlexiModalHeaderTplDirective,
  FlexiModalSpinnerTplDirective,
  FlexiModalsOutletComponent
} from "ngx-flexi-modal";

import {ShowcaseComponent} from "./components/showcase/showcase.component";

@Component({
  selector: 'fm-app-root',
  standalone: true,
  imports: [
    FlexiModalsOutletComponent,
    FlexiModalActionTplDirective,
    FlexiModalHeaderTplDirective,
    FlexiModalSpinnerTplDirective,
    ShowcaseComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
