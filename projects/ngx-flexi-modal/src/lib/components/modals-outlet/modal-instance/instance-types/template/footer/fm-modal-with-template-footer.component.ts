import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

import { FmModalWithTemplateFooterActionsComponent } from './actions/fm-modal-with-template-footer-actions.component';
import { FmModalWithTemplateInstanceComponent } from '../fm-modal-with-template-instance.component';
import { FmModalsOutletComponent } from '../../../../fm-modals-outlet.component';
import { FlexiModalsThemeService } from '../../../../../../services/theme/flexi-modals-theme.service';

@Component({
  selector: 'fm-modal-with-template-footer',
  standalone: true,
  imports: [ NgTemplateOutlet, FmModalWithTemplateFooterActionsComponent ],
  templateUrl: './fm-modal-with-template-footer.component.html',
  styleUrl: './fm-modal-with-template-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'modal-footer',
  }
})
export class FmModalWithTemplateFooterComponent {

  // Dependencies
  private readonly _instance = inject(FmModalWithTemplateInstanceComponent);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly modal = this._instance.modal;
  public readonly modalFooterTpl = this._outlet.modalFooterTpl;
  public readonly themeNameGlobal = this._themes.themeName;


  // Callbacks

  // public onActionContainerClick(closeOnClick: any): void {
  //   if (closeOnClick) {
  //     this.modal().close();
  //   }
  // }
}
