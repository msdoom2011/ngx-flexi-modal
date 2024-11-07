import { Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  FmModalBodyDirective,
  FmModalActionDirective,
  FmModalComponent,
  FmModalFooterDirective,
  FmModalHeaderDirective,
  FmModalOpenEvent,
  FlexiModalsService,
  FlexiModalsThemeService,
  FmModalMaximizedChangeEvent,
  FmModalLoaderComponent,
} from 'ngx-flexi-modal';

import {TemplateAwareComponent} from '../modal-content/template-aware/template-aware.component';
import { ModalWithFormComponent } from '../modal-content/modal-with-form/modal-with-form.component';

@Component({
  selector: 'fm-app-showcase',
  standalone: true,
  imports: [
    FmModalComponent,
    FmModalBodyDirective,
    FmModalBodyDirective,
    FmModalHeaderDirective,
    FmModalFooterDirective,
    FmModalActionDirective,
    FmModalLoaderComponent,
    TemplateAwareComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {

  // Dependencies
  private modals = inject<FlexiModalsService>(FlexiModalsService);
  private modalsThemes = inject<FlexiModalsThemeService>(FlexiModalsThemeService);

  // Signals
  public buttonVisible = signal(true);
  public themesConfigs = this.modalsThemes.themes;
  public themeActive = this.modalsThemes.themeName;


  // Computed

  public themes = computed(() => {
    const themesConfigs = this.themesConfigs();
    const themes = [];

    for (const themeName in themesConfigs) {
      if (Object.prototype.hasOwnProperty.call(themesConfigs, themeName)) {
        themes.push({
          name: themeName,
          default: this.modalsThemes.themeName() === themeName,
          ...themesConfigs[themeName],
        })
      }
    }

    return themes;
  });

  // Callbacks

  public onThemeChange(themeName: string): void {
    this.modalsThemes.setTheme(themeName);
  }

  public onOpenModalAwareComponent(): void {
    // this.modals.open(ModalAwareComponent, {
    this.modals.open(
      import('../modal-content/modal-aware/modal-aware.component').then(i => i.ModalAwareComponent),
      {
        title: 'Modal Aware Component',
        autofocus: false,
        actions: [
          {
            label: 'Okay',
            primary: true,
            onClick: () => alert('Okay!'),
          },
          {
            closeOnClick: false,
            label: 'Show error',
            autofocus: true,
            onClick: () => {
              this.modals.closeAll();
              this.modals.open('error', {
                message: 'Some internal error',
                theme: 'light',
              });
            },
          },
        ],
      },
    );
  }

  public onOpenModalWithForm(): void {
    this.modals.open(ModalWithFormComponent);
  }

  public onOpenError(): void {
    this.modals.open('error', {
      title: 'Error: Failed to process your request, Failed to process your request',
      message:
        'Oops! Some unfortunate error occurred. ' +
        'Please try again later or contact our administrator to get further instructions.',
      onOpen: ($event: FmModalOpenEvent) => {
        $event.modal.startLoading(false);
      }
    });
  }

  public onOpenWarning(): void {
    this.modals.open('warning', {
      title: 'Warning: Disabled functionality',
      message:
        'Currently requested functionality is disabled. ' +
        'To enable it please contact our administrator.'
    });
  }

  public onOpenSuccess(): void {
    this.modals.open('success', 'Your data was successfully saved');
  }

  public onOpenInfo(): void {
    this.modals.open('info', 'Our service was updated to the newer version');
  }

  public onOpenConfirm(): void {
    this.modals.open('confirm', {
      title: 'You have unsaved changes. Are you really sure want to proceed and quit?',
      message: 'You have unsaved changes. Are you really sure want to proceed and quit?',
      // onOpen: (($event) => {
      //   $event.modal.startLoading(false);
      //
      //   setTimeout(() => {
      //     $event.modal.update({ closable: true });
      //
      //     setTimeout(() => {
      //       $event.modal.update({ closable: false });
      //       $event.modal.stopLoading();
      //     }, 4000);
      //   }, 2000);
      // }),
      onMaximize: ($event) => {
        console.log('MAXIMIZE EVENT', $event);
      },
      onMinimize: ($event) => {
        console.log('MINIMIZE EVENT', $event);
      },
    });
  }

  public onTemplateModalOpened($event: FmModalOpenEvent): void {
    console.log($event);
    console.log('TEMPLATE MODAL OPENED!!!');
  }

  public onTemplateModalMaximized($event: FmModalMaximizedChangeEvent): void {
    console.log($event);
    console.log('TEMPLATE MODAL MAXIMIZED!!!');
  }

  public onTemplateModalMinimized($event: FmModalMaximizedChangeEvent): void {
    console.log($event);
    console.log('TEMPLATE MODAL MINIMIZED!!!');
  }
}
