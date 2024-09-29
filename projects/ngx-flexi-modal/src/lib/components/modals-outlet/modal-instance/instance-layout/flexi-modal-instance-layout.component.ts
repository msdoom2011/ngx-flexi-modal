import {
  afterNextRender,
  afterRender,
  ChangeDetectionStrategy,
  Component,
  computed, effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import {NgComponentOutlet, NgTemplateOutlet} from "@angular/common";
import {toObservable} from "@angular/core/rxjs-interop";
import {filter, skip, Subject, takeUntil} from "rxjs";
import {AnimationBuilder} from "@angular/animations";

import {FlexiModalInstanceFooterComponent} from "./footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceHeaderComponent} from "./header/flexi-modal-instance-header.component";
import {TFlexiModalOpeningAnimation} from "../../../../services/modals/flexi-modals.definitions";
import {FlexiModalInstanceLoaderComponent} from "./loader/flexi-modal-instance-loader.component";
import {IFlexiModalTheme} from "../../../../services/theme/flexi-modals-theme.definitions";
import {FLEXI_MODAL_HEADER_ACTION_CLASS} from "./flexi-modal-instance-layout.constants";
import {modalWidthPresets} from "../../../../services/modals/flexi-modals.constants";
import {FlexiModal} from "../../../../models/flexi-modal";
import {
  IFlexiModalMaximizeAnimationParams,
  IFlexiModalMinimizeAnimationParams
} from "./flexi-modal-instance-layout.definitions";
import {
  flexiModalOpeningAnimations,
  getLoaderAnimations,
  getMaximizeAnimations
} from "./flexi-modal-instance-layout.animations";

@Component({
  selector: 'fm-modal-instance-layout',
  templateUrl: './flexi-modal-instance-layout.component.html',
  styleUrl: './flexi-modal-instance-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    FlexiModalInstanceFooterComponent,
    FlexiModalInstanceHeaderComponent,
    FlexiModalInstanceLoaderComponent,
  ],
  host: {
    'class': 'fm-modal--viewport',
    '[class.scrollable]': 'modal().config().scroll === "modal"',
    '[class.maximized]': 'modal().maximized()',
    '[class]': 'hostClasses()',
    '[@maximizeInOut]': `{
      value: modal().maximized() ? "maximized" : "minimized",
      params: getMaximizeAnimationParams(),
    }`,
  },
  animations: [
    ...getMaximizeAnimations('maximizeInOut', 'fadeInOutActions'),
    ...getLoaderAnimations('fadeInOutLoader'),
  ],
})
export class FlexiModalInstanceLayoutComponent implements OnInit, OnDestroy {

  // Dependencies
  private readonly _injector = inject(Injector);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _animationBuilder = inject(AnimationBuilder);

  // Inputs
  public readonly modal = input.required<FlexiModal>();

  // Queries
  private readonly _bodyRef = viewChild.required<ElementRef<HTMLDivElement>>('body');
  private readonly _bodyWrapperRef = viewChild.required<ElementRef<HTMLDivElement>>('bodyWrapper');

  // Signals
  public readonly loaderVisible = signal<boolean>(false);
  private readonly _maximizedChanged = signal<boolean>(false);

  // Private
  private readonly _destroy$ = new Subject<void>();


  // Computed

  public readonly theme = computed<IFlexiModalTheme>(() => {
    return this.modal().theme();
  });

  public readonly backdropVisible = computed<boolean>(() => {
    const modal = this.modal();

    return (
      !modal.config().maximized
      && modal.service.modals().length > 0
      && modal.index() > 0
    );
  });

  public readonly hostClasses = computed<Array<string>>(() => {
    const { width, height, scroll, maximized, position } = this.modal().config();
    const { headerActions } = this.theme().styling;

    return [
      `scroll-${scroll}`,
      `header-actions-${typeof headerActions === 'string' ? headerActions : 'hidden'}`,
      ...(!maximized ? [`position-${position}`] : []),
      ...(height && typeof height === 'string' ? [ `height-${height}` ] : []),
      ...(width && typeof width === 'string' ? [ `width-${height}` ] : []),
    ];
  });

  public readonly headerActionClasses = computed<Array<string>>(() => {
    return [
      FLEXI_MODAL_HEADER_ACTION_CLASS,
      ...(!this.theme().styling.headerActionsWithBg ? ['no-background'] : []),
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
      minWidth: modalWidthPresets['tiny'],
    };

    if (widthOpt in modalWidthPresets) {
      styles.maxWidth = `min(${modalWidthPresets[<keyof typeof modalWidthPresets>widthOpt]}, 100%)`;
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

  /**
   * Making loader visible.
   *
   * Using directly 'modal().loading()' is not possible due to issue with conditional animation disabling.
   * As a workaround, instead of using 'modal().loading()' directly, the loader visibility control
   * is performed by the intermediate 'loaderVisible()' signal.
   */
  private _loadingEffect = effect(() => {
    if (this.modal().loading()) {
      this.loaderVisible.set(true);
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
      this.loaderVisible.set(false);
    }
  }


  // Public methods

  public getMaximizeAnimationParams(): IFlexiModalMaximizeAnimationParams | IFlexiModalMinimizeAnimationParams {
    const hostElement = this._elementRef.nativeElement;
    const bodyElement = this._bodyRef().nativeElement;
    const bodyWrapperElement = this._bodyWrapperRef().nativeElement;
    const bodyBox = bodyElement.getBoundingClientRect();
    const hostBox = hostElement.getBoundingClientRect();
    const hostStyles = window.getComputedStyle(hostElement);
    const bodyStyles = window.getComputedStyle(bodyElement);
    const bodyWrapperStyles = window.getComputedStyle(bodyWrapperElement);

    if (!this.modal().maximized()) {
      return {
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

  private _runOpeningAnimation(animationName: TFlexiModalOpeningAnimation): void {
    const animationConfig = flexiModalOpeningAnimations[animationName];

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
}
