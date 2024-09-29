import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

import {FlexiModal} from "../../../../../models/flexi-modal";
import {
  FlexiModalLoaderRoundDottedSpinnerComponent
} from "./round-dotted-spinner/flexi-modal-loader-round-dotted-spinner.component";
import {
  FlexiModalLoaderRoundDashedSpinnerComponent
} from "./round-dashed-spinner/flexi-modal-loader-round-dashed-spinner.component";
import {
  FlexiModalLoaderLinearDottedSpinnerComponent
} from "./linear-dotted-spinner/flexi-modal-loader-linear-dotted-spinner.component";
import {
  FlexiModalLoaderLinearDashedSpinnerComponent
} from "./linear-dashed-spinner/flexi-modal-loader-linear-dashed-spinner.component";
import {IFlexiModalTheme} from "../../../../../services/theme/flexi-modals-theme.definitions";

@Component({
  selector: 'fm-modal-instance-loader',
  standalone: true,
  imports: [
    FlexiModalLoaderRoundDottedSpinnerComponent,
    FlexiModalLoaderRoundDashedSpinnerComponent,
    FlexiModalLoaderLinearDottedSpinnerComponent,
    FlexiModalLoaderLinearDashedSpinnerComponent
  ],
  templateUrl: './flexi-modal-instance-loader.component.html',
  styleUrl: './flexi-modal-instance-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalInstanceLoaderComponent {

  public modal = input.required<FlexiModal>();

  public theme = computed<IFlexiModalTheme>(() => {
    return this.modal().theme();
  });
}
