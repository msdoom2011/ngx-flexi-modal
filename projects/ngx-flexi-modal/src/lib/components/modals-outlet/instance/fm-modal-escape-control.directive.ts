import { Directive, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import { FmModalInstanceComponent } from './fm-modal-instance.component';

@Directive({
  selector: '[fmModalEscapeControl]',
  standalone: true,
})
export class FmModalEscapeControlDirective implements OnInit, OnDestroy {

  // Dependencies
  private readonly _instance = inject(FmModalInstanceComponent);
  private readonly _zone = inject(NgZone);

  // Signals
  private readonly _modal = this._instance.modal;

  // Private props
  private readonly _destroy$ = new Subject<void>();


  // Lifecycle hooks

  public ngOnInit(): void {
    this._initializeOnEscapeKeydown();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Internal Implementation

  private _initializeOnEscapeKeydown(): void {
    this._zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(($event: KeyboardEvent) => {
            return !!(
              $event.key === 'Escape'
              && this._modal().active()
              && this._modal()?.config().closable
            );
          }),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._modal().close();
        });
    });
  }
}
