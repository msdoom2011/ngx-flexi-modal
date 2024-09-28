import {
  afterNextRender,
  afterRender,
  ChangeDetectionStrategy,
  Component,
  computed,
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

import {flexiModalOpeningAnimations, getMaximizeAnimations} from "./flexi-modal-instance-layout.animations";
import {FlexiModalInstanceFooterComponent} from "./footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceHeaderComponent} from "./header/flexi-modal-instance-header.component";
import {TFlexiModalOpeningAnimation} from "../../../../services/modals/flexi-modals.definitions";
import {FlexiModalsThemeService} from "../../../../services/theme/flexi-modals-theme.service";
import {modalWidthPresets} from "../../../../services/modals/flexi-modals.constants";
import {FlexiModal} from "../../../../models/flexi-modal";
import {FLEXI_MODAL_HEADER_ACTION_CLASS} from "./flexi-modal-instance-layout.constants";
import {
  IFlexiModalMaximizeAnimationParams,
  IFlexiModalMinimizeAnimationParams
} from "./flexi-modal-instance-layout.definitions";

@Component({
  selector: 'fm-modal-instance-layout',
  templateUrl: './flexi-modal-instance-layout.component.html',
  styleUrl: './flexi-modal-instance-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgComponentOutlet,
    FlexiModalInstanceFooterComponent,
    FlexiModalInstanceHeaderComponent,
    NgTemplateOutlet
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
  ],
})
export class FlexiModalInstanceLayoutComponent implements OnInit, OnDestroy {

  // Dependencies
  private readonly _injector = inject(Injector);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _themeService = inject(FlexiModalsThemeService);
  private readonly _animationBuilder = inject(AnimationBuilder);

  // Inputs
  public readonly modal = input.required<FlexiModal>();

  // Queries
  private readonly _bodyRef = viewChild.required<ElementRef<HTMLDivElement>>('body');
  private readonly _bodyWrapperRef = viewChild.required<ElementRef<HTMLDivElement>>('bodyWrapper');

  // Signals
  public readonly theme = this._themeService.theme;
  private readonly _maximizedChanged = signal<boolean>(false);

  // Private
  private readonly _destroy$ = new Subject<void>();


  // Computed

  public readonly isOverlayVisible = computed<boolean>(() => {
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
