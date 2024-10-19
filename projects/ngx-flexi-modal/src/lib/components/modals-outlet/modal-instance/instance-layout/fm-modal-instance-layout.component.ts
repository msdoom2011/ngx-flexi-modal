import {
  afterNextRender,
  afterRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { animate, AnimationBuilder, style } from '@angular/animations';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, skip, Subject, takeUntil } from 'rxjs';

import {
  TFmModalOpeningAnimation,
  TFmModalWidth,
  TFmWidthPreset,
} from '../../../../services/modals/flexi-modals.definitions';
import { FmModalInstanceFooterComponent } from './footer/fm-modal-instance-footer.component';
import { FmModalInstanceHeaderComponent } from './header/fm-modal-instance-header.component';
import { FmModalInstanceLoaderComponent } from './loader/fm-modal-instance-loader.component';
import { fmModalWidthPresets } from '../../../../services/modals/flexi-modals.constants';
import { FmHeaderActionsComponent } from './header/actions/fm-header-actions.component';
import { FM_MODAL_INSTANCE } from '../fm-modal-instance.providers';
import { FmModalInstance } from '../fm-modal-instance';
import { FmModal } from '../../../../models/fm-modal';
import {
  IFmModalMaximizeAnimationParams,
  IFmModalMinimizeAnimationParams,
} from './fm-modal-instance-layout.definitions';
import {
  fmModalOpeningAnimations,
  getLoaderAnimation,
  getMaximizeAnimation,
} from './fm-modal-instance-layout.animations';
import { FLEXI_MODAL_WIDTH_PRESETS } from '../../../../flexi-modals.tokens';

@Component({
  selector: 'fm-modal-instance-layout',
  templateUrl: './fm-modal-instance-layout.component.html',
  styleUrl: './fm-modal-instance-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FmModalInstanceFooterComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceLoaderComponent,
    FmHeaderActionsComponent,
  ],
  host: {
    'data-cy': 'modal-layout',
    'class': 'fm-modal--viewport',
    '[class.scrollable]': 'modal().config().scroll === "modal"',
    '[class.maximized]': 'modal().maximized()',
    '[class]': 'hostClasses()',
    '[@maximizeInOut]': `{
      value: modal().maximized() ? "maximized" : "minimized",
      params: getMaximizeAnimationParams(),
    }`,
    '(@maximizeInOut.done)': 'onMaximizeAnimationDone()'
  },
  animations: [
    getMaximizeAnimation('maximizeInOut'),
    getLoaderAnimation('fadeInOutLoader'),
  ],
})
export class FmModalInstanceLayoutComponent implements OnInit, OnDestroy {

  // Dependencies
  private readonly _injector = inject(Injector);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _animationBuilder = inject(AnimationBuilder);
  private readonly _instance = inject<FmModalInstance<FmModal>>(FM_MODAL_INSTANCE);
  private readonly _widthPresets = inject<Record<TFmWidthPreset, number> | undefined>(FLEXI_MODAL_WIDTH_PRESETS, { optional: true });

  // Queries
  private readonly _bodyRef = viewChild.required<ElementRef<HTMLDivElement>>('body');
  private readonly _bodyWrapperRef = viewChild.required<ElementRef<HTMLDivElement>>('bodyWrapper');
  private readonly _headerWrapperRef = viewChild<ElementRef<HTMLDivElement>>('headerWrapper');
  private readonly _headerActionsRef = viewChild<string, ElementRef<HTMLElement>>('headerActions', { read: ElementRef });

  // Signals
  public readonly modal = this._instance.modal;
  private readonly _loaderVisible = signal<boolean>(false);
  private readonly _maximizedChanged = signal<boolean>(false);

  // Private
  private readonly _destroy$ = new Subject<void>();


  // Computed

  public readonly backdropVisible = computed<boolean>(() => {
    const modal = this.modal();

    return (
      !modal.config().maximized
      && modal.service.modals().length > 0
      && modal.index() > 0
    );
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

  public readonly loaderVisible = computed<boolean>(() => {
    return this._loaderVisible();
  });

  public readonly hostClasses = computed<Array<string>>(() => {
    const { width, height, scroll, maximized, position } = this.modal().config();
    const { headerActionsPosition } = this.modal().theme().styling;

    return [
      `scroll-${scroll}`,
      `header-actions-${typeof headerActionsPosition === 'string' ? headerActionsPosition : 'hidden'}`,
      ...(!maximized ? [`position-${position}`] : []),
      ...(height && typeof height === 'string' ? [ `height-${height}` ] : []),
      ...(width && typeof width === 'string' ? [ `width-${height}` ] : []),
    ];
  });

  public readonly bodyStyles = computed<Partial<CSSStyleDeclaration>>(() => {
    return {
      ...this._widthStyles(),
      ...this._heightStyles(),
    };
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

  private readonly _loadingEffect = effect(() => {
    if (this.modal().loading()) {
      this._loaderVisible.set(true);
    }
  }, {
    allowSignalWrites: true,
  });


  // Lifecycle hooks

  public ngOnInit(): void {
    toObservable(this.modal().maximized, { injector: this._injector })
      .pipe(
        skip(1),
        filter(() => this.modal().active()),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._maximizedChanged.set(true);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public readonly ngAfterNextRender = afterNextRender({ read: () => {
    if (!this.modal().maximized()) {
      this._runOpeningAnimation(this.modal().config().animation);
    }
  }});

  public readonly ngAfterRender = afterRender({ read: () => {
    if (this._maximizedChanged()) {
      this._elementRef.nativeElement.scrollTop = 0;
    }
  }});


  // Callbacks

  public onMaximizeAnimationDone(): void {
    this._runHeaderActionsAnimation();
  }

  public onLoadingAnimationDone(): void {
    if (!this.modal().loading()) {
      this._loaderVisible.set(false);
    }
  }


  // Public methods

  public getMaximizeAnimationParams(): IFmModalMaximizeAnimationParams | IFmModalMinimizeAnimationParams {
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
    };
  }


  // Private methods

  private _getWidthPresets(): Record<TFmWidthPreset, number> {
    return this._widthPresets || fmModalWidthPresets;
  }

  private _isWidthPreset(preset: TFmModalWidth): boolean {
    return typeof preset === 'string' && preset in this._getWidthPresets();
  }

  private _getPresetWidth(preset: TFmWidthPreset): number {
    return this._getWidthPresets()[preset];
  }

  private _runOpeningAnimation(animationName: TFmModalOpeningAnimation): void {
    const animationConfig = fmModalOpeningAnimations[animationName];

    // required for tests
    this._elementRef.nativeElement.dataset['animation'] = animationName;

    if (!animationConfig) {
      return;
    }

    const bodyElement = this._bodyRef().nativeElement;

    if (!animationConfig.validate(bodyElement)) {
      return this._runOpeningAnimation(animationConfig.fallback);
    }

    const factory = this._animationBuilder.build(animationConfig.transition());
    const player = factory.create(bodyElement);

    player.play();
    player.onDone(() => {
      player.destroy();
    });
  }

  private _runHeaderActionsAnimation(): void {
    if (
      !this._headerActionsRef()
      || !this._maximizedChanged()
      || this.modal().maximized()
      || this.modal().theme().styling.headerActionsPosition !== 'outside'
    ) {
      return;
    }

    const factory = this._animationBuilder.build([
      style({ opacity: 0, display: 'flex' }),
      animate('400ms ease-in-out', style({ opacity: 1 })),
    ]);
    const player = factory.create(this._headerActionsRef()?.nativeElement);

    player.play();
    player.onDone(() => {
      player.destroy();
    });
  }
}
