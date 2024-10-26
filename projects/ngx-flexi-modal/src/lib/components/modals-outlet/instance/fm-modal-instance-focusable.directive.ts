import { afterRender, Directive, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil, tap } from 'rxjs';

import { FmModalEventType } from '../../../services/modals/flexi-modals.constants';
import { TFmModalEvent } from '../../../services/modals/flexi-modals.definitions';
import { FM_MODAL_HEADER_ACTION_CLASS } from './fm-modal-instance.constants';
import { FmModalInstanceComponent } from './fm-modal-instance.component';
import { findFocusableElements } from '../../../tools/utils';

type TFocusableElement = Element & { focus: () => void };

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
  private readonly _destroy$ = new Subject<void>();
  private _focusableElementsUpdateRequested = false;
  private _focusableElementBeforeInactive: TFocusableElement | null = null;


  // Effects

  private readonly _focusableElementsEffect = effect(() => {
    if (!this._modal().ready()) {
      return;
    }

    const isFocusInModal = this._instanceElementRef.nativeElement.contains(document.activeElement);
    const isAutofocusEnabled = this._modal().config().autofocus;
    const isActive = this._modal().active();

    this._updateFocusableElements();

    if (isActive && this._focusableElementBeforeInactive) {
      this._focusableElementBeforeInactive.focus?.();
      this._focusableElementBeforeInactive = null;

      return;
    }

    if (isActive || isFocusInModal) {
      (<any>document.activeElement).blur();
    }

    if (!isActive || !isAutofocusEnabled || isFocusInModal) {
      return;
    }

    this._makeInitialFocus();
  }, {
    allowSignalWrites: true,
  });


  // Lifecycle hooks

  public ngOnInit(): void {
    this._initializeModalListeners();
    this._initializeOnTabKeydown();
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

  private _initializeModalListeners(): void {
    this._modal().events$
      .pipe(
        tap(($event: TFmModalEvent) => {
          if ($event.type === FmModalEventType.Active && !$event.active) {
            this._focusableElementBeforeInactive = <TFocusableElement>document.activeElement;
          }
        }),
        filter(() => this._modal().active()),
        takeUntil(this._destroy$)
      )
      .subscribe(($event: TFmModalEvent) => {
        switch ($event.type) {
          case FmModalEventType.Ready:
          case FmModalEventType.ContentChange:
            this._focusableElementsUpdateRequested = true;
            break;

          case FmModalEventType.Update: {
            const { actions, actionsTpl, headerTpl, footerTpl } = $event.changes;

            if (actions || actionsTpl || headerTpl || footerTpl) {
              this._focusableElementsUpdateRequested = true;
            }
          }
        }
      });
  }

  private _initializeOnTabKeydown(): void {
    const modalElement = this._instanceElementRef.nativeElement;

    this._zone.runOutsideAngular(() => {
      fromEvent<FocusEvent>(window, 'focus', { capture: true })
        .pipe(
          filter(() => this._modal().active()),
          takeUntil(this._destroy$),
        )
        .subscribe(($event: FocusEvent) => {
          if (
            !$event.target
            || !($event.target instanceof Element)
          ) {
            return;

          } else if (!modalElement.contains($event.target)) {
            this._makeInitialFocus();
          }
        });

      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(($event: KeyboardEvent) => {
            return $event.key === 'Tab' && this._modal().active();
          }),
          takeUntil(this._destroy$),
        )
        .subscribe(($event: KeyboardEvent) => {
          this._onTabKeydownCallback($event);
        });
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

  private _makeInitialFocus(): void {
    const focusableElements = this._focusableElements();

    for (const element of focusableElements) {
      if (element.matches('[autofocus], [fm-autofocus="true"]')) {
        element.focus();

        return;
      }
    }

    let focusSucceeded = false;

    for (const element of focusableElements) {
      if (!element.classList.contains(FM_MODAL_HEADER_ACTION_CLASS)) {
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
}
