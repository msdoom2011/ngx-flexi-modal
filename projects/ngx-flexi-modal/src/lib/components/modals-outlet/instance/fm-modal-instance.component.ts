import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { FmModalContentWithComponentComponent } from './content/fm-modal-content-with-component.component';
import { FmModalContentWithTemplateComponent } from './content/fm-modal-content-with-template.component';
import { FmModalInstanceHeaderComponent } from './layout/header/fm-modal-instance-header.component';
import { FmModalInstanceFooterComponent } from './layout/footer/fm-modal-instance-footer.component';
import { FmModalInstanceLayoutComponent } from './layout/fm-modal-instance-layout.component';
import { FlexiModalsThemeService } from '../../../services/theme/flexi-modals-theme.service';
import { FmModalEscapeControlDirective } from './fm-modal-escape-control.directive';
import { FlexiModalsService } from '../../../services/modals/flexi-modals.service';
import { FmModalFocusControlDirective } from './fm-modal-focus-control.directive';
import { FmModal } from '../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance',
  templateUrl: './fm-modal-instance.component.html',
  styleUrl: './fm-modal-instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FmModalInstanceLayoutComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceFooterComponent,
    FmModalContentWithComponentComponent,
    FmModalContentWithTemplateComponent,
    FmModalFocusControlDirective,
    FmModalEscapeControlDirective,
  ],
  host: {
    'data-cy': 'modal',
    '[id]': 'id()',
    '[class]': 'hostClasses()',
  },
  hostDirectives: [
    FmModalEscapeControlDirective,
    FmModalFocusControlDirective,
  ]
})
// export class FmModalInstanceComponent<ModalT extends FmModal<any, any> = FmModal<any, any>> implements OnDestroy {
export class FmModalInstanceComponent implements OnDestroy {

  // Dependencies
  private readonly _service = inject(FlexiModalsService);
  private readonly _themes = inject(FlexiModalsThemeService);

  // Inputs
  public readonly modal = input.required<FmModal<any, any>>();

  // Private props
  private readonly _destroy$ = new Subject<void>();
  private _modalDestroySubscription: Subscription | null = null;


  // Computed

  public readonly id = computed<string>(() => {
    return this.modal().id();
  });

  public readonly index = computed<number>(() => {
    return this._service.modals().findIndex(modal => modal.id() === this.id());
  });

  public readonly hostClasses = computed<Array<string>>(() => {
    return [
      'fm-modal-instance',
      ...(this.modal().config().classes || []),
      ...(this._themes.isThemeExist(<string>this.modal().config().theme)
        ? [ this._themes.getThemeClass(this.modal().config().theme || '') ]
        : []
      ),
    ];
  });


  // Effects

  private readonly _activeUntilEffect = effect(() => {
    const modalDestroy$ = this.modal().config().openUntil;

    if (!modalDestroy$) {
      return;
    }

    if (this._modalDestroySubscription) {
      this._modalDestroySubscription.unsubscribe();
    }

    this._modalDestroySubscription = modalDestroy$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.modal().close());
  });


  // Lifecycle hooks

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
