import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  viewChild
} from '@angular/core';
import {NgComponentOutlet, NgTemplateOutlet} from "@angular/common";
import {AnimationBuilder} from "@angular/animations";

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
    '[class.maximized]': 'modal().maximized()',
    '[class]': 'hostClasses()'
  }
})
export class FlexiModalInstanceLayoutComponent {

  // Dependencies
  private readonly _themeService = inject(FlexiModalsThemeService);
  private readonly _animationBuilder = inject(AnimationBuilder);

  // Inputs
  public readonly modal = input.required<FlexiModal>();

  // Queries
  private readonly _bodyRef = viewChild.required<ElementRef<HTMLDivElement>>('body');

  // Signals
  public readonly theme = this._themeService.theme;


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

  public readonly ngAfterNextRender = afterNextRender({ read: () => {
    if (!this.modal().maximized()) {
      this._runOpeningAnimation(this.modal().config().animation);
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
