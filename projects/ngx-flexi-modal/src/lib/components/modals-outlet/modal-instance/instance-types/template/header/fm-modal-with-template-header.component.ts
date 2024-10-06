import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FlexiModalsThemeService } from '../../../../../../services/theme/flexi-modals-theme.service';
import { FmModalWithTemplateInstanceComponent } from '../fm-modal-with-template-instance.component';
import { FmModalsOutletComponent } from '../../../../fm-modals-outlet.component';

@Component({
  selector: 'fm-modal-with-template-header',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './fm-modal-with-template-header.component.html',
  styleUrl: './fm-modal-with-template-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'modal-header'
  }
})
export class FmModalWithTemplateHeaderComponent {

  // Dependencies
  private readonly _instance = inject(FmModalWithTemplateInstanceComponent);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly modalHeaderTpl = this._outlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
