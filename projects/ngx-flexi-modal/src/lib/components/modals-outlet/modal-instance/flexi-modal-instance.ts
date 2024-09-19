import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  InputSignal,
  OnChanges,
  OnDestroy, OnInit,
  SimpleChanges,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import {Subject, Subscription, takeUntil} from "rxjs";

import {FlexiModalThemeService} from "../../../services/theme/flexi-modal-theme.service";
import {FlexiModalsService} from "../../../flexi-modals.service";
import {findFocusableElements} from "../../../tools/utils";
import {FlexiModal} from "../../../modals/flexi-modal";

@Directive({
  host: {
    '[id]': 'id()',
    '[class]': '_classes()',
    '(window:keydown.Escape)': 'onEscapePress()',
    '(window:keydown)': 'onTabPress($event)',
  },
})
export abstract class FlexiModalInstance<ModalT extends FlexiModal> implements OnChanges, OnDestroy {

  // Dependencies
  public service = inject(FlexiModalsService);
  protected _themeService = inject(FlexiModalThemeService);
  protected _elementRef = inject(ElementRef<HTMLElement>);
  protected _injector = inject(Injector);

  // Inputs
  public modal!: InputSignal<ModalT>;

  // Public props
  public contentRef = viewChild('content', { read: ViewContainerRef });

  // Private props
  private _destroy$ = new Subject<void>();
  private _destroySubscription!: Subscription;
  private _theme: string = this._themeService.themeName();


  // Computed

  public id = computed(() => {
    return <string>this.modal().id;
  });

  public index = computed(() => {
    return this.service.modals()
      .findIndex(modalConfig => modalConfig.id === this.id());
  });

  public _classes = computed(() => {
    return [
      'fm-modal',
      ...(this.modal().config.classes || [])
    ];
  });

  private _focusableElements = computed(() => {
    return findFocusableElements(this._elementRef.nativeElement);
  });


  // Effects

  private _modalActiveEffect = effect(() => {
    const focusInModal = this._elementRef.nativeElement.contains(document.activeElement);
    const isActive = this.modal().active;

    if (!isActive && focusInModal) {
      (<any>document.activeElement).blur();

    } else if (isActive && !focusInModal) {
      this._focusableElements()[0]?.focus();
    }
  });

  private _modalConfigEffect = effect(() => {
    const theme = this.modal().config.theme;

    if (!theme || theme === this._theme) {
      return;
    }

    this._themeService.applyTheme(this._elementRef.nativeElement, theme);
  });


  // Lifecycle hooks

  public ngOnChanges(changes: SimpleChanges): void {
    const { config } = changes;

    if (config?.currentValue) {
      this._initialize();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Callbacks

  public onEscapePress(): void {
    if (this.modal().active && this.modal()?.config.closable) {
      this.modal().close();
    }
  }

  public onTabPress($event: KeyboardEvent): void {
    if (!this.modal().active || $event.key !== 'Tab') {
      return;
    }

    const elements = this._focusableElements();

    if (!elements.length) {
      $event.preventDefault();

      return;
    }

    const focusedElement = <Element & { focus: () => any }>document.activeElement;
    let indexToFocus = elements.indexOf(focusedElement);

    if (indexToFocus < 0) {
      $event.preventDefault();
      elements[0].focus();

      return;
    }

    indexToFocus += !$event.shiftKey ? 1 : -1;

    if (!elements[indexToFocus]) {
      $event.preventDefault();

      if (indexToFocus >= elements.length) {
        indexToFocus = 0;

      } else if (indexToFocus < 0) {
        indexToFocus = elements.length - 1;
      }

      elements[indexToFocus].focus();
    }
  }


  // Internal implementation

  private _initialize(): void {
    const modalDestroy$ = this.modal().config.aliveUntil;

    if (!modalDestroy$) {
      return;
    }

    if (this._destroySubscription) {
      this._destroySubscription.unsubscribe();
    }

    this._destroySubscription = modalDestroy$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.modal().close());
  }
}
