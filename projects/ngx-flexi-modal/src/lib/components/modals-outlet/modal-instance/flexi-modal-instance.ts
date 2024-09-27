import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  InputSignal,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import {delay, filter, fromEvent, Subject, Subscription, takeUntil} from "rxjs";
import {toObservable} from "@angular/core/rxjs-interop";

import {FLEXI_MODAL_HEADER_ACTION_CLASS} from "./instance-layout/flexi-modal-instance-layout.component";
import {FlexiModalsThemeService} from "../../../services/theme/flexi-modals-theme.service";
import {FlexiModalsService} from "../../../services/modals/flexi-modals.service";
import {findFocusableElements} from "../../../tools/utils";
import {FlexiModal} from "../../../models/flexi-modal";

@Directive({
  host: {
    '[id]': 'id()',
    '[class]': 'classes()',
  },
})
export abstract class FlexiModalInstance<ModalT extends FlexiModal> implements OnInit, OnDestroy {

  // Dependencies
  public readonly service = inject(FlexiModalsService);
  protected readonly _themeService = inject(FlexiModalsThemeService);
  protected readonly _elementRef = inject(ElementRef<HTMLElement>);
  protected readonly _injector = inject(Injector);
  protected readonly _zone = inject(NgZone);

  // Inputs
  public abstract readonly modal: InputSignal<ModalT>;

  // Signals
  private _focusableElements = signal<Array<Element & { focus: () => any }>>([]);

  // Public props
  public readonly contentRef = viewChild('content', { read: ViewContainerRef });
  public readonly viewportRef = viewChild('viewport', { read: ElementRef<HTMLDivElement> });

  // Private props
  private readonly _destroy$ = new Subject<void>();
  private _destroySubscription: Subscription | null = null;
  private _themeOld = this._themeService.themeName();
  private _maximizedOld = false;


  // Computed

  public readonly id = computed<string>(() => {
    return this.modal().id();
  });

  public readonly index = computed<number>(() => {
    return this.service.modals().findIndex(modal => modal.id() === this.id());
  });

  public readonly classes = computed<Array<string>>(() => {
    return [
      'fm-modal-instance',
      ...(this.modal().config().classes || [])
    ];
  });


  // Effects

  private readonly _scrollTopEffect = effect(() => {
    const { maximized, scroll } = this.modal().config();
    const viewportRef = this.viewportRef();
    const isActive = this.modal().active();

    if (
      !isActive
      || !viewportRef
      || scroll !== 'modal'
      || maximized === this._maximizedOld
    ) {
      return;
    }

    viewportRef.nativeElement.scrollTop = 0;
    this._maximizedOld = maximized;
  });

  private readonly _activeUntilEffect = effect(() => {
    const modalDestroy$ = this.modal().config().aliveUntil;

    if (!modalDestroy$) {
      return;
    }

    if (this._destroySubscription) {
      this._destroySubscription.unsubscribe();
    }

    this._destroySubscription = modalDestroy$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.modal().close());
  });

  private readonly _focusableElementsEffect = effect(() => {
    const focusInModal = this._elementRef.nativeElement.contains(document.activeElement);
    const isActive = this.modal().active();

    if (!isActive && focusInModal) {
      (<any>document.activeElement).blur();

    } else if (isActive && !focusInModal) {
      const focusableElements = this._focusableElements();
      let focusSucceeded = false;

      for (const element of focusableElements) {
        if (!element.classList.contains(FLEXI_MODAL_HEADER_ACTION_CLASS)) {
          focusSucceeded = true;
          element.focus();
          break;
        }
      }

      if (!focusSucceeded && focusableElements.length) {
        focusableElements[0].focus();

      } else if (!focusableElements.length) {
        (<any>document.activeElement).blur();
      }
    }
  });

  private readonly _themeEffect = effect(() => {
    const theme = this.modal().config().theme;

    if (!theme || theme === this._themeOld) {
      return;
    }

    this._themeService.applyThemeStyles(this._elementRef.nativeElement, theme);
  });


  // Lifecycle hooks

  public ngOnInit(): void {
    this._initializeFocusableElements();
    this._initializeOnEscapeKeydown();
    this._initializeOnTabKeydown();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Internal implementation

  protected _initializeFocusableElements(): void {
    toObservable(this.modal().maximized, { injector: this._injector })
      .pipe(
        delay(10),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._focusableElements.set(
          findFocusableElements(this._elementRef.nativeElement)
        );
      });
  }

  protected _initializeOnEscapeKeydown(): void {
    this._zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(($event: KeyboardEvent) => {
            return !!(
              $event.key === 'Escape'
              && this.modal().active()
              && this.modal()?.config().closable
            );
          }),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._zone.run(() => {
            this.modal().close();
          });
        });
    });
  }

  protected _initializeOnTabKeydown(): void {
    this._zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(($event: KeyboardEvent) => {
            return $event.key === 'Tab' && this.modal().active();
          }),
          takeUntil(this._destroy$),
        )
        .subscribe(($event: KeyboardEvent) => {
          this._zone.run(() => {
            this._onTabKeydownCallback($event);
          });
        });
    });
  }

  protected _onTabKeydownCallback($event: KeyboardEvent): void {
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
}
