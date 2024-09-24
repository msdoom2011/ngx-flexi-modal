import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalsThemeService} from "../../../../../../services/theme/flexi-modals-theme.service";
import {FlexiModalWithTemplate} from "../../../../../../models/flexi-modal-with-template";
import {FlexiModalsOutletComponent} from "../../../../flexi-modals-outlet.component";

@Component({
  selector: 'fm-modal-template-header',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './flexi-modal-template-header.component.html',
  styleUrl: './flexi-modal-template-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalTemplateHeaderComponent {

  // Dependencies
  private _modalsOutlet = inject(FlexiModalsOutletComponent);
  private _themeService = inject(FlexiModalsThemeService);

  // Inputs
  public modal = input.required<FlexiModalWithTemplate>();

  // Signals
  public modalHeaderTpl = this._modalsOutlet.modalHeaderTpl;
  public themeNameGlobal = this._themeService.themeName;
}
