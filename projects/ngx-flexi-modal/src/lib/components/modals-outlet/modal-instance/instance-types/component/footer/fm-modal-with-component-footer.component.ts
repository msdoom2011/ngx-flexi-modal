import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FmModalWithComponentFooterActionsComponent } from './actions/fm-modal-with-component-footer-actions.component';
import { FmModalWithComponentInstanceComponent } from '../fm-modal-with-component-instance.component';
import { FlexiModalsThemeService } from '../../../../../../services/theme/flexi-modals-theme.service';
import { FmModalsOutletComponent } from '../../../../fm-modals-outlet.component';

@Component({
  selector: 'fm-modal-with-component-footer',
  imports: [ NgTemplateOutlet, FmModalWithComponentFooterActionsComponent ],
  templateUrl: './fm-modal-with-component-footer.component.html',
  styleUrl: './fm-modal-with-component-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    'data-cy': 'modal-footer',
  }
})
export class FmModalWithComponentFooterComponent {

  // Dependencies
  private readonly _instance = inject(FmModalWithComponentInstanceComponent);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly modalFooterTpl = this._outlet.modalFooterTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
