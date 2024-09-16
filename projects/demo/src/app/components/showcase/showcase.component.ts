import {Component, inject, signal, viewChild} from '@angular/core';
import {
  FlexiModalButtonDirective,
  FlexiModalButtonsComponent,
  FlexiModalComponent,
  FlexiModalsService,
  FlexiModalHeaderComponent,
  FlexiModalFooterComponent,
} from "ngx-flexi-modal";

import {ModalAwareComponent} from "../modal-content/modal-aware/modal-aware.component";

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    FlexiModalButtonsComponent,
    FlexiModalComponent,
    FlexiModalHeaderComponent,
    FlexiModalFooterComponent,
    FlexiModalButtonDirective,
    ModalAwareComponent,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {

  // Dependencies
  private modalsService = inject<FlexiModalsService>(FlexiModalsService);

  // Queries
  private modalRef = viewChild('modal');

  // Signals
  public modalVisible = signal(false);
  public buttonVisible = signal(true);

  // Callbacks

  public onOpenComponentModal(): void {
    this.modalsService.showComponent(ModalAwareComponent);
  }

  public onOpenError(): void {
    this.modalsService.show('error', {
      title: 'Error: Failed to process your request',
      message:
        'Oops! Some unfortunate error occurred. ' +
        'Please try again later or contact our administrator to get further instructions.'
    });
  }

  public onOpenWarning(): void {
    this.modalsService.show('warning', {
      title: 'Warning: Disabled functionality',
      message:
        'Currently requested functionality is disabled. ' +
        'To enable it please contact our administrator.'
    });
  }

  public onOpenSuccess(): void {
    this.modalsService.show('success', {
      message: 'Your data was successfully saved'
    });
  }

  public onOpenInfo(): void {
    this.modalsService.show('info', {
      message: 'Our service was updated to the newer version'
    });
  }

  public onOpenConfirm(): void {
    this.modalsService.show('confirm', {
      message: 'You have unsaved changes. Are you really sure want to proceed and quit?'
    });
  }
}
