import {Component, inject, signal} from '@angular/core';
import {
  FlexiModalBodyDirective,
  FlexiModalActionDirective,
  FlexiModalComponent,
  FlexiModalFooterDirective,
  FlexiModalHeaderDirective,
  FlexiModalOpenEvent,
  FlexiModalsService,
  FlexiButtonComponent,
} from "ngx-flexi-modal";

import {ModalAwareComponent} from "../modal-content/modal-aware/modal-aware.component";
import {TemplateAwareComponent} from "../modal-content/template-aware/template-aware.component";

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [
    FlexiModalComponent,
    FlexiModalBodyDirective,
    FlexiModalBodyDirective,
    FlexiModalHeaderDirective,
    FlexiModalFooterDirective,
    FlexiModalActionDirective,
    FlexiButtonComponent,
    ModalAwareComponent,
    TemplateAwareComponent,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {

  // Dependencies
  private modalsService = inject<FlexiModalsService>(FlexiModalsService);

  // Signals
  public buttonVisible = signal(true);

  // Callbacks

  public onOpenComponentModal(): void {
    this.modalsService.showComponent(ModalAwareComponent, {
      title: 'Modal title',
      actions: [
        {
          label: 'Okay',
          onClick: () => alert('Okay!')
        }
      ]
    });
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

  public onTemplateModalOpened($event: FlexiModalOpenEvent): void {
    console.log($event);
    console.log('TEMPLATE MODAL OPENED!!!');
  }
}
