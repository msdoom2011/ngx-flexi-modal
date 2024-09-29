import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  TemplateRef
} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgTemplateOutlet} from "@angular/common";
import {Subject, takeUntil} from "rxjs";

import {FmModalBeforeCloseEvent} from "../../services/modals/events/fm-modal-before-close.event";
import {FmModalBeforeOpenEvent} from "../../services/modals/events/fm-modal-before-open.event";
import {getBackdropAnimation, getInstanceAnimation} from "./fm-modals-outlet.animations";
import {FlexiModalsThemeService} from "../../services/theme/flexi-modals-theme.service";
import {FmModalSpinnerTplDirective} from "./directives/fm-modal-spinner-tpl.directive";
import {FmModalActionTplDirective} from "./directives/fm-modal-action-tpl.directive";
import {FmModalHeaderTplDirective} from "./directives/fm-modal-header-tpl.directive";
import {FlexiModalsService} from "../../services/modals/flexi-modals.service";
import {
  FmModalWithComponentInstanceComponent
} from "./modal-instance/instance-types/component/fm-modal-with-component-instance.component";
import {
  FmModalWithTemplateInstanceComponent
} from "./modal-instance/instance-types/template/fm-modal-with-template-instance.component";

@Component({
  selector: 'fm-modals-outlet',
  templateUrl: './fm-modals-outlet.component.html',
  styleUrl: './fm-modals-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FmModalWithComponentInstanceComponent,
    FmModalWithTemplateInstanceComponent,
    NgForOf,
  ],
  animations: [
    getBackdropAnimation('fadeInOutBackdrop'),
    getInstanceAnimation('fadeInOutInstance'),
  ],
})
export class FmModalsOutletComponent implements OnInit {

  // Dependencies
  private readonly _service = inject(FlexiModalsService);
  private readonly _themes = inject(FlexiModalsThemeService);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _changeDetector = inject(ChangeDetectorRef);

  // Signals
  public readonly modals = this._service.modals;
  public readonly theme = this._themes.theme;
  public readonly backdropAnimationDisabled = signal<boolean>(false);
  public readonly backdropAnimationDelay = signal<number>(0);

  // Queries
  private readonly _modalActionTplRef = contentChild(FmModalActionTplDirective);
  private readonly _modalHeaderTplRef = contentChild(FmModalHeaderTplDirective);
  private readonly _modalSpinnerTplRef = contentChild(FmModalSpinnerTplDirective);

  // Private props
  private readonly _destroy$ = new Subject<void>();
  private _bodyStyleElement: HTMLStyleElement | null = null;


  // Computed props

  public readonly modalActionTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalActionTplRef()?.templateRef;
  });

  public readonly modalHeaderTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalHeaderTplRef()?.templateRef;
  });

  public readonly modalSpinnerTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._modalSpinnerTplRef()?.templateRef;
  });


  // Effects

  private readonly _themeEffect = effect(() => {
    this._themes.applyThemeStyles(this._elementRef.nativeElement);
  });

  private readonly _modalsEffect = effect(() => {
    if (this.modals().length > 0 && !this._bodyStyleElement) {
      this._bodyStyleElement = document.createElement('style');

      this._bodyStyleElement.id = 'fm-modals-styles';
      this._bodyStyleElement.type = 'text/css';
      this._bodyStyleElement.innerHTML = 'body { overflow: hidden }';

      document.getElementsByTagName('head')[0].appendChild(this._bodyStyleElement);

    } else if (!this.modals().length && this._bodyStyleElement) {
      this._bodyStyleElement.remove();
      this._bodyStyleElement = null;
    }
  });


  // Lifecycle hooks

  public ngOnInit(): void {
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
          this._changeDetector.detectChanges();
        }
      });
  }


  // Callbacks

  public onBackdropAnimationDone(): void {
    this.backdropAnimationDisabled.set(false);
    this.backdropAnimationDelay.set(0);
  }
}
