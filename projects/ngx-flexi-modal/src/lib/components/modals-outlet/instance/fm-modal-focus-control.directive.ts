import { afterRender, Directive, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import { FM_MODAL_HEADER_ACTION_CLASS } from './layout/fm-modal-instance-layout.constants';
import { FmModalEventType } from '../../../services/modals/flexi-modals.constants';
import { TFmModalEvent } from '../../../services/modals/flexi-modals.definitions';
import { FmModalInstanceComponent } from './fm-modal-instance.component';
import { findFocusableElements } from '../../../tools/utils';

@Directive({
  selector: '[fmModalFocusControl]',
  standalone: true,
})
export class FmModalFocusControlDirective implements OnInit, OnDestroy {

  // Dependencies
  private readonly _instance = inject(FmModalInstanceComponent);
  private readonly _instanceElementRef = inject(ElementRef<HTMLElement>);
  private readonly _zone = inject(NgZone);

  // Signals
  private readonly _modal = this._instance.modal;
  private readonly _focusableElements = signal<Array<Element & { focus: () => any }>>([]);

  // Private props
  private readonly _destroy$ = new Subject<void>();
  private _focusableElementsUpdateRequested = false;


  // Effects

  private readonly _focusableElementsEffect = effect(() => {
    if (!this._modal().ready()) {
      return;
    }

    const isFocusInModal = this._instanceElementRef.nativeElement.contains(document.activeElement);
    const isAutofocusEnabled = this._modal().config().autofocus;
    const isActive = this._modal().active();

    if (!isActive && isFocusInModal) {
      return (<any>document.activeElement).blur();

    } else if (!isActive || !isAutofocusEnabled || isFocusInModal) {
      return;
    }

    this._makeInitialFocus();
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
      this._focusableElements.set(findFocusableElements(this._instanceElementRef.nativeElement));
    }
  }});


  // Internal implementation

  private _initializeModalListeners(): void {
    this._modal().events$
      .pipe(
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

    const focusedElement = <Element & { focus: () => any }>document.activeElement;
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
