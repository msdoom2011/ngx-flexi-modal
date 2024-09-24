import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalsThemeService} from "../../../../../../services/theme/flexi-modals-theme.service";
import {FlexiModalWithComponent} from "../../../../../../models/flexi-modal-with-component";
import {FlexiModalsOutletComponent} from "../../../../flexi-modals-outlet.component";

@Component({
  selector: 'fm-modal-component-header',
  standalone: true,
  templateUrl: './flexi-modal-component-header.component.html',
  styleUrl: './flexi-modal-component-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class FlexiModalComponentHeaderComponent {

  // Dependencies
  private _modalsOutlet = inject(FlexiModalsOutletComponent);
  private _themeService = inject(FlexiModalsThemeService);

  // Inputs
  public modal = input.required<FlexiModalWithComponent>();

  // Signals
  public modalHeaderTpl = this._modalsOutlet.modalHeaderTpl;
  public themeNameGlobal = this._themeService.themeName;
}
