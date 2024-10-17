import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgComponentOutlet, NgForOf, NgTemplateOutlet } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { FmModalBeforeCloseEvent } from '../../services/modals/events/fm-modal-before-close.event';
import { FmModalBeforeOpenEvent } from '../../services/modals/events/fm-modal-before-open.event';
import { getBackdropAnimation, getInstanceAnimation } from './fm-modals-outlet.animations';
import { FlexiModalsThemeService } from '../../services/theme/flexi-modals-theme.service';
import { FmModalSpinnerTplDirective } from './directives/fm-modal-spinner-tpl.directive';
import { FmModalActionTplDirective } from './directives/fm-modal-action-tpl.directive';
import { FmModalHeaderTplDirective } from './directives/fm-modal-header-tpl.directive';
import { FmModalFooterTplDirective } from './directives/fm-modal-footer-tpl.directive';
import { FlexiModalsService } from '../../services/modals/flexi-modals.service';
import {
  FmModalInstanceWithComponentComponent
} from './modal-instance/instance-types/fm-modal-instance-with-component.component';
import {
  FmModalInstanceWithTemplateComponent
} from './modal-instance/instance-types/fm-modal-instance-with-template.component';

const MODAL_OPENED_CLASS = 'fm-modal-opened';

@Component({
  selector: 'fm-modals-outlet',
  templateUrl: './fm-modals-outlet.component.html',
  styleUrl: './fm-modals-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FmModalInstanceWithComponentComponent,
    FmModalInstanceWithTemplateComponent,
    NgForOf,
  ],
  host: {
    'data-cy': 'modals-outlet',
    '[class]': 'hostClasses()'
  },
  animations: [
    getBackdropAnimation('fadeInOutBackdrop'),
    getInstanceAnimation('fadeInOutInstance'),
  ],
})
export class FmModalsOutletComponent implements OnInit, OnDestroy {

  // Dependencies
  private readonly _service = inject(FlexiModalsService);
  private readonly _themes = inject(FlexiModalsThemeService);
  private readonly _changeDetector = inject(ChangeDetectorRef);

  // Signals
  public readonly modals = this._service.modals;
  public readonly themeClass = this._themes.themeClass;
  public readonly backdropAnimationDisabled = signal<boolean>(false);
  public readonly backdropAnimationDelay = signal<number>(0);

  // Queries
  private readonly _modalActionTplRef = contentChild(FmModalActionTplDirective);
  private readonly _modalHeaderTplRef = contentChild(FmModalHeaderTplDirective);
  private readonly _modalFooterTplRef = contentChild(FmModalFooterTplDirective);
  private readonly _modalSpinnerTplRef = contentChild(FmModalSpinnerTplDirective);

  // Private props
  private readonly _destroy$ = new Subject<void>();


  // Computed props

  public readonly hostClasses = computed<Array<string>>(() => {
    return [ this.themeClass() ];
  });

  public readonly modalActionTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalActionTplRef()?.templateRef;
  });

  public readonly modalHeaderTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalHeaderTplRef()?.templateRef;
  });

  public readonly modalFooterTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalFooterTplRef()?.templateRef;
  });

  public readonly modalSpinnerTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalSpinnerTplRef()?.templateRef;
  });


  // Effects

  private readonly _modalOpenedEffect = effect(() => {
    this.modals().length > 0
      ? document.body.classList.add(MODAL_OPENED_CLASS)
      : document.body.classList.remove(MODAL_OPENED_CLASS);
  });


  // Lifecycle hooks

  public ngOnInit(): void {
    this._themes.attachThemeStyles();

    this._service.events$
      .pipe(takeUntil(this._destroy$))
      .subscribe(($event) => {
        if (
          $event instanceof FmModalBeforeOpenEvent
          && this.modals().length === 0
          && $event.modal.maximized()
        ) {
          this.backdropAnimationDelay.set(500);

        } else if (
          $event instanceof FmModalBeforeCloseEvent
          && this.modals().length === 1
          && $event.modal.maximized()
        ) {
          this.backdropAnimationDisabled.set(true);

          // Required to get updated backdropAnimationDisabled binding in time
          this._changeDetector.detectChanges();
        }
      });
  }

  public ngOnDestroy(): void {
    this._themes.detachThemeStyles();
  }


  // Callbacks

  public onBackdropAnimationDone(): void {
    this.backdropAnimationDisabled.set(false);
    this.backdropAnimationDelay.set(0);
  }
}
