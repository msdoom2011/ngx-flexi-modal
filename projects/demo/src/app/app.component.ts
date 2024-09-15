import {Component, inject} from '@angular/core';
import {FlexiModalsComponent, FlexiModalsService} from "ngx-flexi-modal";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FlexiModalsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private modalsService = inject<FlexiModalsService>(FlexiModalsService);

  public openModal(): void {
    this.modalsService.show('error', {
      title: 'Error: Network issues',
      message: [
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
      ],
      onClose: () => {
        alert('CLOSE!!!');
      }
      // messageAlign: 'left',
      // icon: null
    });
  }
}
