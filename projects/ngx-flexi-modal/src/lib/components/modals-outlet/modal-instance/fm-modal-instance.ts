import {
  afterRender,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {filter, fromEvent, Subject, Subscription, takeUntil} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

import {FM_MODAL_HEADER_ACTION_CLASS} from './instance-layout/fm-modal-instance-layout.constants';
import {FlexiModalsThemeService} from '../../../services/theme/flexi-modals-theme.service';
import {FlexiModalsService} from '../../../services/modals/flexi-modals.service';
import {findFocusableElements} from '../../../tools/utils';
import {FmModal} from '../../../models/fm-modal';

@Directive({
  standalone: true,
  host: {
    '[id]': 'id()',
    '[class]': 'hostClasses()',
  },
})
export abstract class FmModalInstance<ModalT extends FmModal> implements OnInit, OnDestroy {

  // Dependencies
  protected readonly _service = inject(FlexiModalsService);
  protected readonly _themes = inject(FlexiModalsThemeService);
  protected readonly _elementRef = inject(ElementRef<HTMLElement>);
  protected readonly _injector = inject(Injector);
  protected readonly _zone = inject(NgZone);

  // Inputs

  /**
   * Specifying the explicit type of the 'modal' property is necessary due to issue
   * of not recognizing correctly the specified modal type in the child component templates
   */
  public readonly modal: InputSignal<ModalT> = input.required<ModalT>();

  // Signals
  private readonly _focusableElements = signal<Array<Element & { focus: () => any }>>([]);
  private readonly _focusableElementsUpdateRequested = signal<boolean>(true);

  // Public props
  protected readonly _contentRef = viewChild.required('content', { read: ViewContainerRef });
  protected readonly _viewportRef = viewChild.required('viewport', { read: ElementRef<HTMLElement> });

  // Private props
  private readonly _destroy$ = new Subject<void>();
  private _destroySubscription: Subscription | null = null;


  // Computed

  public readonly id = computed<string>(() => {
    return this.modal().id();
  });

  public readonly index = computed<number>(() => {
    return this._service.modals().findIndex(modal => modal.id() === this.id());
  });

  public readonly hostClasses = computed<Array<string>>(() => {
    return [
      'fm-modal-instance',
      ...(this.modal().config().classes || []),
      ...(this.modal().config().theme
        ? [ this._themes.getThemeClass(this.modal().config().theme || '') ]
        : []
      ),
    ];
  });


  // Effects

  private readonly _activeUntilEffect = effect(() => {
    const modalDestroy$ = this.modal().config().openUntil;

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
    const focusableElements = this._focusableElements();
    const isActive = this.modal().active();

    if (!isActive && focusInModal) {
      return (<any>document.activeElement).blur();

    } else if (!isActive || focusInModal) {
      return;
    }

    const viewportBox = this._viewportRef().nativeElement.getBoundingClientRect();
    let focusSucceeded = false;

    for (const element of focusableElements) {
      if (!element.classList.contains(FM_MODAL_HEADER_ACTION_CLASS)) {
        const elementBox = element.getBoundingClientRect();

        if (viewportBox.height < elementBox.top) {
          continue;
        }

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

  public ngAfterRender = afterRender({ read: () => {
    if (this._focusableElementsUpdateRequested()) {
      this._focusableElementsUpdateRequested.set(false);
      this._focusableElements.set(findFocusableElements(this._elementRef.nativeElement));
    }
  }});


  // Internal implementation

  protected _initializeFocusableElements(): void {
    toObservable(this.modal().maximized, { injector: this._injector })
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._focusableElementsUpdateRequested.set(true);
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
