import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';

import {IFlexiModalTheme} from "../../../../../services/theme/flexi-modals-theme.definitions";
import {FlexiModalsOutletComponent} from "../../../flexi-modals-outlet.component";
import {FlexiModal} from "../../../../../models/flexi-modal";
import {
  FlexiModalLoaderRoundDottedSpinnerComponent
} from "./spinners/round-dotted-spinner/flexi-modal-loader-round-dotted-spinner.component";
import {
  FlexiModalLoaderRoundDashedSpinnerComponent
} from "./spinners/round-dashed-spinner/flexi-modal-loader-round-dashed-spinner.component";
import {
  FlexiModalLoaderLinearDottedSpinnerComponent
} from "./spinners/linear-dotted-spinner/flexi-modal-loader-linear-dotted-spinner.component";
import {
  FlexiModalLoaderLinearDashedSpinnerComponent
} from "./spinners/linear-dashed-spinner/flexi-modal-loader-linear-dashed-spinner.component";
import {NgTemplateOutlet} from "@angular/common";
import {FlexiModalsThemeService} from "../../../../../services/theme/flexi-modals-theme.service";

@Component({
  selector: 'fm-modal-instance-loader',
  standalone: true,
  imports: [
    FlexiModalLoaderRoundDottedSpinnerComponent,
    FlexiModalLoaderRoundDashedSpinnerComponent,
    FlexiModalLoaderLinearDottedSpinnerComponent,
    FlexiModalLoaderLinearDashedSpinnerComponent,
    NgTemplateOutlet
  ],
  templateUrl: './flexi-modal-instance-loader.component.html',
  styleUrl: './flexi-modal-instance-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalInstanceLoaderComponent {

  // Dependencies
  private readonly _outlet = inject(FlexiModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FlexiModal>();

  // Signals
  public spinnerTpl = this._outlet.modalSpinnerTpl;
  public globalThemeName = this._themes.themeName;


  // Computed

  public theme = computed<IFlexiModalTheme>(() => {
    return this.modal().theme();
  });
}
