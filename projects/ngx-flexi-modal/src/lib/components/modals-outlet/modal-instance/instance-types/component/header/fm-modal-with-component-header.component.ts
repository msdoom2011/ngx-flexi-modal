import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalsThemeService} from "../../../../../../services/theme/flexi-modals-theme.service";
import {FmModalWithComponent} from "../../../../../../models/fm-modal-with-component";
import {FmModalsOutletComponent} from "../../../../fm-modals-outlet.component";

@Component({
  selector: 'fm-modal-with-component-header',
  standalone: true,
  templateUrl: './fm-modal-with-component-header.component.html',
  styleUrl: './fm-modal-with-component-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class FmModalWithComponentHeaderComponent {

  // Dependencies
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FmModalWithComponent>();

  // Signals
  public readonly modalHeaderTpl = this._outlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
