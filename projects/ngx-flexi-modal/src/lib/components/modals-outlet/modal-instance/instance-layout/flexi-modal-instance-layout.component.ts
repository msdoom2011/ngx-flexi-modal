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
import {AnimationBuilder} from "@angular/animations";
import {filter, Subject, takeUntil} from "rxjs";

import {FlexiModalInstanceFooterComponent} from "./footer/flexi-modal-instance-footer.component";
import {FlexiModalInstanceHeaderComponent} from "./header/flexi-modal-instance-header.component";
import {TFlexiModalOpeningAnimation} from "../../../../services/modals/flexi-modals.definitions";
import {FlexiModalsThemeService} from "../../../../services/theme/flexi-modals-theme.service";
import {flexiModalOpeningAnimations} from "./flexi-modal-instance-layout.animations";
import {modalWidthPresets} from "../../../../services/modals/flexi-modals.constants";
import {FlexiModal} from "../../../../models/flexi-modal";

export const FLEXI_MODAL_HEADER_ACTION_CLASS = 'fm-modal--header-action';
export const FLEXI_MODAL_HEADER_ACTIONS_OUTER_SELECTOR = '.fm-modal--header-actions.position-outside';

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
    '[class]': 'hostClasses()'
  }
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

  // Signals
  public readonly theme = this._themeService.theme;
  private readonly _scrollTopRequired = signal<boolean>(true);

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
        filter(() => this.modal().active()),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._scrollTopRequired.set(true);
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
    if (this._scrollTopRequired()) {
      this._elementRef.nativeElement.scrollTop = 0;
    }
  }});


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

    const animationFactory = this._animationBuilder.build(animationConfig.transition());
    const player = animationFactory.create(bodyElement);

    player.play();
    player.onDone(() => {
      player.destroy();
    });
  }
}
