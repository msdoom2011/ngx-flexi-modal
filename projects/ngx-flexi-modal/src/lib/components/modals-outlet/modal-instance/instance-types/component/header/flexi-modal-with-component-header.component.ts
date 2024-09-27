import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalsThemeService} from "../../../../../../services/theme/flexi-modals-theme.service";
import {FlexiModalWithComponent} from "../../../../../../models/flexi-modal-with-component";
import {FlexiModalsOutletComponent} from "../../../../flexi-modals-outlet.component";

@Component({
  selector: 'fm-modal-with-component-header',
  standalone: true,
  templateUrl: './flexi-modal-with-component-header.component.html',
  styleUrl: './flexi-modal-with-component-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class FlexiModalWithComponentHeaderComponent {

  // Dependencies
  private readonly _modalsOutlet = inject(FlexiModalsOutletComponent);
  private readonly _themeService = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FlexiModalWithComponent>();

  // Signals
  public readonly modalHeaderTpl = this._modalsOutlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themeService.themeName;
}
