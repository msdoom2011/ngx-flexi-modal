import { Component } from '@angular/core';
import { AppComponent } from '../../projects/demo/src/app/app.component';
import { FmModalsOutletComponent } from 'ngx-flexi-modal';

@Component({
  selector: 'fm-test-app',
  templateUrl: './app-test.component.html',
  styleUrl: './app-test.component.scss',
  standalone: true,
  imports: [
    AppComponent,
    FmModalsOutletComponent,
  ]
})
export class AppTestComponent {}
