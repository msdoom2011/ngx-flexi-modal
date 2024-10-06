import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FmModalWithComponentInstanceComponent } from '../fm-modal-with-component-instance.component';
import { FlexiModalsThemeService } from '../../../../../../services/theme/flexi-modals-theme.service';
import { FmModalsOutletComponent } from '../../../../fm-modals-outlet.component';

@Component({
  selector: 'fm-modal-with-component-header',
  standalone: true,
  templateUrl: './fm-modal-with-component-header.component.html',
  styleUrl: './fm-modal-with-component-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    'data-cy': 'modal-header'
  }
})
export class FmModalWithComponentHeaderComponent {

  // Dependencies
  private readonly _instance = inject(FmModalWithComponentInstanceComponent);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly modalHeaderTpl = this._outlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
