import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

import {FlexiModalsThemeService} from "../../../../../../services/theme/flexi-modals-theme.service";
import {FmModalWithTemplate} from "../../../../../../models/fm-modal-with-template";
import {FmModalsOutletComponent} from "../../../../fm-modals-outlet.component";

@Component({
  selector: 'fm-modal-with-template-header',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './fm-modal-with-template-header.component.html',
  styleUrl: './fm-modal-with-template-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalWithTemplateHeaderComponent {

  // Dependencies
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FmModalWithTemplate>();

  // Signals
  public readonly modalHeaderTpl = this._outlet.modalHeaderTpl;
  public readonly themeNameGlobal = this._themes.themeName;
}
