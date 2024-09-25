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
  private readonly _modalsOutlet = inject(FlexiModalsOutletComponent);
  private readonly _themeService = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FlexiModalWithTemplate>();

  // Signals
  public readonly modalHeaderTpl = this._modalsOutlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themeService.themeName;
}
