import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { animate, AnimationBuilder, style } from '@angular/animations';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { filter, Subject, Subscription, takeUntil } from 'rxjs';

import { FmModalContentWithComponentComponent } from './content/fm-modal-content-with-component.component';
import { FmModalContentWithTemplateComponent } from './content/fm-modal-content-with-template.component';
import { FmModalEventType, fmModalWidthPresets } from '../../../services/modals/flexi-modals.constants';
import { FlexiModalsThemeService } from '../../../services/theme/flexi-modals-theme.service';
import { FmModalInstanceFooterComponent } from './footer/fm-modal-instance-footer.component';
import { FmModalInstanceHeaderComponent } from './header/fm-modal-instance-header.component';
import { FmModalInstanceLoaderComponent } from './loader/fm-modal-instance-loader.component';
import { FmModalInstanceEscapableDirective } from './fm-modal-instance-escapable.directive';
import { FmModalInstanceFocusableDirective } from './fm-modal-instance-focusable.directive';
import { FmModalReadyEvent } from '../../../services/modals/events/fm-modal-ready.event';
import { FmHeaderActionsComponent } from './header/actions/fm-header-actions.component';
import { FlexiModalsService } from '../../../services/modals/flexi-modals.service';
import { FLEXI_MODAL_WIDTH_PRESETS } from '../../../flexi-modals.tokens';
import { FmModal } from '../../../models/fm-modal';
import {
  TFmModalEvent,
  TFmModalOpeningAnimation,
  TFmModalWidth,
  TFmWidthPreset,
} from '../../../services/modals/flexi-modals.definitions';
import {
  IFmHeightAdjustParams,
  IFmModalMaximizeAnimationParams,
  IFmModalMinimizeAnimationParams,
} from './fm-modal-instance.definitions';
import {
  fmModalOpeningAnimations,
  getHeightAdjustAnimation,
  getLoaderAnimation,
  getMaximizeAnimation,
} from './fm-modal-instance.animations';

@Component({
  selector: 'fm-modal-instance',
  templateUrl: './fm-modal-instance.component.html',
  styleUrl: './fm-modal-instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FmModalInstanceFooterComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceLoaderComponent,
    FmHeaderActionsComponent,
    FmModalContentWithComponentComponent,
    FmModalContentWithTemplateComponent,
  ],
  hostDirectives: [
    FmModalInstanceEscapableDirective,
    FmModalInstanceFocusableDirective,
  ],
  host: {
    'data-cy': 'modal',
    'class': 'fm-modal-instance',
    '[id]': 'modal().id()',
    '[class]': 'hostClasses()',
    '[class.active]': 'modal().active()',
    '[class.scrollable]': 'modal().config().scroll === "modal"',
    '[class.maximized]': 'modal().maximized()',
    '[style.--modal-index]': 'modal().index()',
  },
  animations: [
    getHeightAdjustAnimation('adjustHeight'),
    getMaximizeAnimation('maximizeInOut'),
    getLoaderAnimation('fadeInOutLoader'),
  ],
})
export class FmModalInstanceComponent implements OnInit, OnDestroy {

  // Dependencies
  private readonly _service = inject(FlexiModalsService);
  private readonly _themes = inject(FlexiModalsThemeService);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _animationBuilder = inject(AnimationBuilder);
  private readonly _widthPresets = inject<Record<TFmWidthPreset, number> | undefined>(FLEXI_MODAL_WIDTH_PRESETS, { optional: true });

  // Inputs
  public readonly modal = input.required<FmModal<any, any>>();

  // Queries
  private readonly _bodyRef = viewChild.required<ElementRef<HTMLDivElement>>('body');
  private readonly _bodyWrapperRef = viewChild.required<ElementRef<HTMLDivElement>>('bodyWrapper');
  private readonly _headerWrapperRef = viewChild<ElementRef<HTMLDivElement>>('headerWrapper');
  private readonly _headerActionsRef = viewChild<string, ElementRef<HTMLElement>>('headerActions', { read: ElementRef });

  // Signals
  public readonly heightAdjustAnimationValue = signal<boolean>(true);
  public readonly heightAdjustAnimationParams = signal<IFmHeightAdjustParams>(<any>{});
  public readonly maximizeAnimationParams = signal<IFmModalMaximizeAnimationParams | IFmModalMinimizeAnimationParams>(<any>{});
  private readonly _loaderVisible = signal<boolean>(false);

  // Private
  private readonly _destroy$ = new Subject<void>();
  private readonly _createdAt = new Date();
  private _maximizedChanged = false;
  private _modalDestroySubscription: Subscription | null = null;


  // Computed

  public readonly hostClasses = computed<Array<string>>(() => {
    const { width, height, scroll, maximized, position, classes, theme } = this.modal().config();

    return [
      `scroll-${scroll}`,
      ...(!maximized ? [`position-${position}`] : []),
      ...(height && typeof height === 'string' ? [ `height-${height}` ] : []),
      ...(width && typeof width === 'string' ? [ `width-${height}` ] : []),
      ...(this._themes.isThemeExist(theme) ? [ this._themes.getThemeClass(theme || '') ] : []),
      ...(classes || []),
    ];
  });

  public readonly headerVisible = computed<boolean>(() => {
    const config = this.modal().config();

    return !!(
      config.title
      || config.headerTpl
      || (
        this.modal().theme().styling.headerActionsPosition !== 'outside'
        && (
          config.closable
          || config.maximizable
        )
      )
    );
  });

  public readonly backdropVisible = computed<boolean>(() => {
    return this.modal().index() > 0;
  });

  public readonly loaderVisible = computed<boolean>(() => {
    return this._loaderVisible();
  });

  public readonly bodyStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    return { ...this._widthStyles(), ...this._heightStyles() };
  });

  private readonly _widthStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    const { width: widthOpt, maximized: maximizeOpt } = this.modal().config();

    if (maximizeOpt) {
      return {};
    }

    const styles: Partial<CSSStyleDeclaration> = {
      minWidth: `${this._getPresetWidth('tiny')}px`,
    };

    if (this._isWidthPreset(widthOpt)) {
      styles.maxWidth = `min(${this._getPresetWidth(<TFmWidthPreset>widthOpt)}px, 100%)`;
      styles.width = '100%';

    } else if (typeof widthOpt === 'number') {
      styles.maxWidth = `min(${widthOpt}px, 100%)`;
      styles.width = '100%';
    }

    return styles;
  });

  private readonly _heightStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    const { height: heightOpt } = this.modal().config();
    const styles: Partial<CSSStyleDeclaration> = {};

    if (typeof heightOpt === 'number') {
      styles.maxHeight = heightOpt + 'px';
    }

    return styles;
  });


  // Effects

  private readonly _activeEffect = effect(() => {
    this._runHeaderActionsAnimation(this.modal().active());
  });

  private readonly _loadingEffect = effect(() => {
    if (this.modal().loading()) {
      this._loaderVisible.set(true);
    }
  }, {
    allowSignalWrites: true,
  });

  private readonly _openUntilEffect = effect(() => {
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

  public ngOnInit(): void {
    this._listenModalEvents();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public readonly ngAfterNextRender = afterNextRender({ read: () => {
    if (!this.modal().maximized()) {
      this._runOpeningAnimation(this.modal().config().animation, () => {
        this._service.emitEvent(new FmModalReadyEvent(this.modal(), true));
      });
    }
  }});


  // Callbacks

  public onMaximizeAnimationDone(): void {
    // Needed to check if the animation had indeed been performed because of a known issue
    // https://github.com/angular/angular/issues/23535

    if (this._maximizedChanged) {
      this._maximizedChanged = false;

      if (
        !this.modal().maximized()
        && this.modal().theme().styling.headerActionsPosition === 'outside'
      ) {
        this._runHeaderActionsAnimation(true);
      }
    }
  }

  public onLoadingAnimationDone(): void {
    if (!this.modal().loading()) {
      this._loaderVisible.set(false);
    }
  }


  // Private methods

  private _listenModalEvents(): void {
    this.modal().events$
      .pipe(
        filter(() => this.modal().active()),
        takeUntil(this._destroy$),
      )
      .subscribe(($event: TFmModalEvent) => {
        switch ($event.type) {
          case FmModalEventType.MaximizedChange:
            this.maximizeAnimationParams.set(this._calcMaximizeAnimationParams());
            this._maximizedChanged = true;
            break;

          case FmModalEventType.ContentChange:
            if (
              !this.modal().maximized()
              && new Date().valueOf() - this._createdAt.valueOf() > 50
            ) {
              this.heightAdjustAnimationParams.set(this._calcHeightAdjustAnimationParams());
              this.heightAdjustAnimationValue.update(prevValue => !prevValue);
            }
            break;
        }
      });
  }

  private _getWidthPresets(): Record<TFmWidthPreset, number> {
    return this._widthPresets || fmModalWidthPresets;
  }

  private _isWidthPreset(preset: TFmModalWidth): boolean {
    return typeof preset === 'string' && preset in this._getWidthPresets();
  }

  private _getPresetWidth(preset: TFmWidthPreset): number {
    return this._getWidthPresets()[preset];
  }

  private _runOpeningAnimation(animationName: TFmModalOpeningAnimation, callback?: () => void): void {
    const animationConfig = fmModalOpeningAnimations[animationName];

    // required for tests
    this._elementRef.nativeElement.dataset['animation'] = animationName;

    if (!animationConfig) {
      return;
    }

    const bodyElement = this._bodyRef().nativeElement;

    if (!animationConfig.validate(bodyElement)) {
      return this._runOpeningAnimation(animationConfig.fallback, callback);
    }

    const factory = this._animationBuilder.build(animationConfig.transition());
    const player = factory.create(bodyElement);

    player.play();
    player.onDone(() => {
      player.destroy();
      callback?.();
    });
  }

  private _runHeaderActionsAnimation(show: boolean, callback?: () => void): void {
    if (!this._headerActionsRef()) {
      return;
    }

    const duration = 400;
    const factory = this._animationBuilder.build([
      style({ opacity: show ? 0 : 1, display: 'flex' }),
      animate(`${duration}ms ease-in-out`, style({ opacity: show ? 1 : 0 })),
    ]);
    const player = factory.create(this._headerActionsRef()?.nativeElement);

    player.play();
    player.onDone(() => {
      player.destroy();
      callback?.();
    });
  }

  private _calcHeightAdjustAnimationParams(): IFmHeightAdjustParams {
    const bodyBox = this._bodyRef().nativeElement.getBoundingClientRect();

    return {
      height: `${bodyBox.height}px`,
    };
  }

  private _calcMaximizeAnimationParams(): IFmModalMaximizeAnimationParams | IFmModalMinimizeAnimationParams {
    const hostElement = this._elementRef.nativeElement;
    const bodyElement = this._bodyRef().nativeElement;
    const bodyWrapperElement = this._bodyWrapperRef().nativeElement;
    const bodyBox = bodyElement.getBoundingClientRect();
    const hostBox = hostElement.getBoundingClientRect();
    const hostStyles = window.getComputedStyle(hostElement);
    const bodyStyles = window.getComputedStyle(bodyElement);
    const bodyWrapperStyles = window.getComputedStyle(bodyWrapperElement);

    if (!this.modal().maximized()) {
      const headerHeight = this._headerWrapperRef()
        ? this._headerWrapperRef()?.nativeElement.getBoundingClientRect().height
        : 0;

      return {
        headerHeight: headerHeight + 'px',
        alignItems: (
          bodyBox.height
          + parseInt(bodyWrapperStyles.paddingTop)
          + parseInt(bodyWrapperStyles.paddingBottom)
        ) > hostBox.height
          ? 'flex-start'
          : hostStyles.alignItems,
      };
    }

    return {
      width: bodyBox.width + 'px',
      height: bodyBox.height + 'px',
      paddingTop: bodyWrapperStyles.paddingTop,
      paddingBottom: bodyWrapperStyles.paddingBottom,
      paddingLeft: bodyWrapperStyles.paddingLeft,
      paddingRight: bodyWrapperStyles.paddingRight,
      borderRadius: bodyStyles.borderRadius,
      boxShadow: bodyStyles.boxShadow,
    };
  }
}
