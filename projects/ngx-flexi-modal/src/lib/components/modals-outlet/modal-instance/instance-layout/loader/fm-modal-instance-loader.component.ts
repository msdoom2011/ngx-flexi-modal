import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { FmLinearDashedSpinnerComponent } from './spinners/linear-dashed-spinner/fm-linear-dashed-spinner.component';
import { FmLinearDottedSpinnerComponent } from './spinners/linear-dotted-spinner/fm-linear-dotted-spinner.component';
import { FmRoundDottedSpinnerComponent } from './spinners/round-dotted-spinner/fm-round-dotted-spinner.component';
import { FmRoundDashedSpinnerComponent } from './spinners/round-dashed-spinner/fm-round-dashed-spinner.component';
import { FlexiModalsThemeService } from '../../../../../services/theme/flexi-modals-theme.service';
import { IFmModalTheme } from '../../../../../services/theme/flexi-modals-theme.definitions';
import { FmModalsOutletComponent } from '../../../fm-modals-outlet.component';
import { getLoaderAnimation } from './fm-modal-instance-loader.animations';
import { FM_MODAL_INSTANCE } from '../../fm-modal-instance.providers';
import { FmModalInstance } from '../../fm-modal-instance';
import { FmModal } from '../../../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance-loader',
  standalone: true,
  imports: [
    FmRoundDottedSpinnerComponent,
    FmRoundDashedSpinnerComponent,
    FmLinearDottedSpinnerComponent,
    FmLinearDashedSpinnerComponent,
    NgTemplateOutlet
  ],
  templateUrl: './fm-modal-instance-loader.component.html',
  styleUrl: './fm-modal-instance-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.visible]': 'modal().loading()',
  },
  animations: [
    getLoaderAnimation('fadeInOutLoader'),
  ]
})
export class FmModalInstanceLoaderComponent {

  // Dependencies
  private readonly _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);
  private readonly _outlet = inject(FmModalsOutletComponent);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Signals
  public readonly visible = signal<boolean>(false);
  public readonly modal = this._instance.modal;
  public readonly spinnerTpl = this._outlet.modalSpinnerTpl;
  public readonly globalThemeName = this._themes.themeName;


  // Computed

  public readonly theme = computed<IFmModalTheme>(() => {
    return this.modal().theme();
  });


  // Effects

  /**
   * Making loader visible.
   *
   * Using directly 'modal().loading()' is not possible due to issue with conditional animation disabling.
   * As a workaround, instead of using 'modal().loading()' directly, the loader visibility control
   * is performed by the intermediate 'loaderVisible()' signal.
   */
  private _loadingEffect = effect(() => {
    if (this.modal().loading()) {
      this.visible.set(true);
    }
  }, {
    allowSignalWrites: true,
  });


  // Callbacks

  /**
   * Hiding loading by setting loaderVisible signal to false.
   *
   * Switching loader visibility using the (@fadeInOutLoader.done) event is a forced step.
   * Angular requires that values in [@.disabled] expression to be updated before the loader disappear from the DOM.
   * In case of hiding the loader using the seemingly obvious 'modal().loading()' condition directly,
   * Angular doesn't update the [@.disabled] binding value and just hides loader using the previous animation settings.
   */
  public onLoadingAnimationDone(): void {
    if (!this.modal().loading()) {
      this.visible.set(false);
    }
  }
}
