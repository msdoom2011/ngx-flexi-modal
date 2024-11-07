import { afterRender, Directive, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { filter, fromEvent, merge, skip, Subject, takeUntil, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { FmModalEventType } from '../../../services/modals/flexi-modals.constants';
import { TFmModalEvent } from '../../../services/modals/flexi-modals.definitions';
import { FM_MODAL_HEADER_ACTION_CLASS } from './fm-modal-instance.constants';
import { FmModalInstanceComponent } from './fm-modal-instance.component';
import { findFocusableElements } from '../../../tools/utils';

type TFocusableElement = Element & {
  focus: () => void;
  blur: () => void;
};

@Directive({
  selector: '[fmModalInstanceFocusable]',
  standalone: true,
})
export class FmModalInstanceFocusableDirective implements OnInit, OnDestroy {

  // Dependencies
  private readonly _instance = inject(FmModalInstanceComponent);
  private readonly _instanceElementRef = inject(ElementRef<HTMLElement>);
  private readonly _zone = inject(NgZone);

  // Signals
  private readonly _modal = this._instance.modal;
  private readonly _focusableElements = signal<Array<TFocusableElement>>([]);

  // Private props
  private readonly _active$ = toObservable(this._modal).pipe(skip(1));
  private readonly _destroy$ = new Subject<void>();
  private _focusableElementsUpdateRequested = false;
  private _focusableElementBeforeInactive: TFocusableElement | null = null;
  private _returnFocusToModalTimeout: any = null;
  private _closed = false;


  // Getters

  private get _autofocusEnabled(): boolean {
    return this._modal().config().autofocus;
  }


  // Effects

  private readonly _modalActiveEffect = effect(() => {
    if (!this._modal().ready() || this._closed) {
      return;
    }

    const isFocusInModal = this._instanceElementRef.nativeElement.contains(document.activeElement);
    const isActive = this._modal().active();

    this._updateFocusableElements();

    if (isActive && this._focusableElementBeforeInactive) {
      // This condition should not work during the first modal appearance.
      // Delay is necessary to prevent buttons to be clicked (for example)
      // when closing the another overlay modal by the Enter key.
      const focusTimeout = setTimeout(() => {
        clearTimeout(focusTimeout);

        this._focusableElementBeforeInactive?.focus?.();
        this._focusableElementBeforeInactive = null;
      });

      return;
    }

    if (isActive || isFocusInModal) {
      (<any>document.activeElement).blur();
    }

    if (isActive && this._autofocusEnabled && !isFocusInModal) {
      this._makeInitialFocus();
    }
  }, {
    allowSignalWrites: true,
  });

  private readonly _modalReadyEffect = effect(() => {
    if (
      this._modal().ready()
      && !this._autofocusEnabled
      && !this._focusableElementBeforeInactive
    ) {
      this._updateFocusableElements();
      this._focusableElementBeforeInactive = this._findInitialFocusableElement();
    }
  }, {
    allowSignalWrites: true,
  });


  // Lifecycle hooks

  public ngOnInit(): void {
    this._listenToModalEvents();
    this._listenToDomEvents();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public ngAfterRender = afterRender({ read: () => {
    if (this._modal().ready() && this._focusableElementsUpdateRequested) {
      this._focusableElementsUpdateRequested = false;
      this._updateFocusableElements();
    }
  }});


  // Internal implementation

  private _updateFocusableElements(): void {
    this._focusableElements.set(findFocusableElements(this._instanceElementRef.nativeElement));
  }

  private _listenToModalEvents(): void {
    this._modal().events$
      .pipe(
        tap(($event: TFmModalEvent) => {
          if ($event.type === FmModalEventType.Close) {
            this._closed = true;
          }
        }),
        filter(() => this._modal().active()),
        takeUntil(this._destroy$)
      )
      .subscribe(($event: TFmModalEvent) => {
        switch ($event.type) {
          case FmModalEventType.Active:
            this._listenToDomEvents();
            break;

          case FmModalEventType.Ready:
          case FmModalEventType.ContentChange: {
            this._focusableElementsUpdateRequested = true;
            break;
          }
          case FmModalEventType.Update: {
            const { actions, actionsTpl, headerTpl, footerTpl } = $event.changes;

            if (actions || actionsTpl || headerTpl || footerTpl) {
              this._focusableElementsUpdateRequested = true;
            }
            break;
          }
        }
      });
  }

  private _listenToDomEvents(): void {
    this._zone.runOutsideAngular(() => {
      this._listenToWindowBlurEvent();
      this._listenToWindowFocusEvent();
      this._listenToWindowKeydownEvent();
      this._listenToWindowVisibilityChangeEvent();
    });
  }

  private _listenToWindowVisibilityChangeEvent(): void {
    fromEvent(window, 'visibilitychange')
      .pipe(
        filter(() => this._modal().active()),
        takeUntil(merge(this._active$, this._destroy$)),
      )
      .subscribe(() => {
        if (document.hidden && this._returnFocusToModalTimeout) {
          clearTimeout(this._returnFocusToModalTimeout);
          this._returnFocusToModalTimeout = null;
        }
      });
  }

  private _listenToWindowBlurEvent(): void {
    fromEvent(window, 'blur')
      .pipe(
        filter(() => this._modal().active()),
        takeUntil(merge(this._active$, this._destroy$)),
      )
      .subscribe(($event: Event) => {
        if (document.hidden) {
          return;
        }

        (<Window>$event.target).focus();

        this._returnFocusToModalTimeout = setTimeout(() => {
          this._makeInitialFocus();

          clearTimeout(this._returnFocusToModalTimeout);
          this._returnFocusToModalTimeout = null;
        }, 50);
      });
  }

  private _listenToWindowFocusEvent(): void {
    const modalElement = this._instanceElementRef.nativeElement;

    fromEvent<FocusEvent>(window, 'focus', { capture: true })
      .pipe(
        filter(() => this._modal().active()),
        takeUntil(merge(this._active$, this._destroy$)),
      )
      .subscribe(($event: FocusEvent) => {
        if (!($event.target instanceof Element)) {
          return;

        } else if (modalElement.contains($event.target)) {
          this._focusableElementBeforeInactive = <TFocusableElement>document.activeElement;

        } else {
          this._makeInitialFocus();
        }
      });
  }

  private _listenToWindowKeydownEvent(): void {
    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(
        filter(($event: KeyboardEvent) => $event.key === 'Tab' && this._modal().active()),
        takeUntil(merge(this._active$, this._destroy$)),
      )
      .subscribe(($event: KeyboardEvent) => {
        this._onTabKeydownCallback($event);
      });
  }

  private _onTabKeydownCallback($event: KeyboardEvent): void {
    const elements = this._focusableElements();

    if (!elements.length) {
      $event.preventDefault();

      return;
    }

    const focusedElement = <TFocusableElement>document.activeElement;
    let indexToFocus = elements.indexOf(focusedElement);

    if (
      focusedElement !== document.body
      && !this._instanceElementRef.nativeElement.contains(focusedElement)
    ) {
      $event.preventDefault();
      this._makeInitialFocus();

      return;

    } else if (indexToFocus < 0) {
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

  private _findInitialFocusableElement(): TFocusableElement | null {
    const focusableElements = this._focusableElements();

    for (const element of focusableElements) {
      if (element.matches('[autofocus], [fm-autofocus="true"]')) {
        return element;
      }
    }

    for (const element of focusableElements) {
      if (!element.classList.contains(FM_MODAL_HEADER_ACTION_CLASS)) {
        return element;
      }
    }

    if (focusableElements.length) {
      return focusableElements[0];
    }

    return null;
  }

  private _makeInitialFocus(): void {
    const initialElement = this._findInitialFocusableElement();

    if (initialElement) {
      initialElement.focus();

    } else {
      (<any>document.activeElement).blur();
    }
  }
}
