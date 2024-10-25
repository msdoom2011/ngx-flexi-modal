import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, Type } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';
import { delay, Subject, takeUntil } from 'rxjs';

import { FmModalWithComponent } from '../../../../models/fm-modal-with-component';
import { FmModalInstanceContent } from './fm-modal-instance-content';
import { IFmModalAware } from '../../../fm-modal.abstract';

@Component({
  selector: 'fm-modal-content-with-component',
  templateUrl: './fm-modal-instance-content.html',
  styleUrl: './fm-modal-instance-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class FmModalContentWithComponentComponent
extends FmModalInstanceContent<FmModalWithComponent>
implements OnInit, AfterViewInit, OnDestroy {

  // Private props

  private _startLoading$ = new Subject<void>();
  private _stopLoading$ = new Subject<void>();
  private _destroy$ = new Subject<void>();


  // Lifecycle hooks

  public ngOnInit(): void {
    this._startLoading$
      .pipe(
        delay(50),
        takeUntil(this._stopLoading$),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.modal().startLoading(false);
      });

    this._stopLoading$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.modal().stopLoading();
      });
  }

  public ngAfterViewInit(): void {
    const modal = this.modal();
    const content = modal.content;

    if (content instanceof Promise) {
      this._startLoading$.next();

      content.then(component => {
        modal.markContentChanged();
        this._stopLoading$.next();
        this._renderComponent(component);
      });

      return;
    }

    this._renderComponent(content);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Private implementation

  private _renderComponent(component: Type<Partial<IFmModalAware>>): void {
    const modal = this.modal();
    const content$ = modal.content$;
    const componentRef = this._contentRef()?.createComponent(component);
    const componentInputs = modal.config().inputs;

    if (componentRef?.instance.modal && componentRef.instance.modal[SIGNAL]) {
      componentRef.setInput('modal', modal);
    }

    if (componentRef && componentInputs) {
      for (const inputName in componentInputs) {
        if (Object.hasOwnProperty.call(componentInputs, inputName)) {
          componentRef.setInput(inputName, componentInputs[inputName]);
        }
      }
    }

    content$.next(componentRef || null);
    content$.complete();
  }
}
