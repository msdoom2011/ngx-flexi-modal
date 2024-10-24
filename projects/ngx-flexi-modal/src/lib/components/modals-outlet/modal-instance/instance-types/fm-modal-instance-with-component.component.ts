import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, Type } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';
import { NgComponentOutlet } from '@angular/common';
import { delay, Subject, takeUntil } from 'rxjs';

import { FmModalInstanceHeaderComponent } from '../instance-layout/header/fm-modal-instance-header.component';
import { FmModalInstanceFooterComponent } from '../instance-layout/footer/fm-modal-instance-footer.component';
import { FmModalInstanceLayoutComponent } from '../instance-layout/fm-modal-instance-layout.component';
import { FmModalWithComponent } from '../../../../models/fm-modal-with-component';
import { FM_MODAL_INSTANCE } from '../fm-modal-instance.providers';
import { IFmModalAware } from '../../../fm-modal.abstract';
import { FmModalInstance } from '../fm-modal-instance';

@Component({
  selector: 'fm-modal-instance-with-component',
  templateUrl: '../fm-modal-instance.html',
  styleUrl: '../fm-modal-instance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FmModalInstanceLayoutComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceFooterComponent,
    NgComponentOutlet,
  ],
  providers: [
    { provide: FM_MODAL_INSTANCE, useExisting: FmModalInstanceWithComponentComponent },
  ],
})
export class FmModalInstanceWithComponentComponent<ComponentT extends Partial<IFmModalAware>>
extends FmModalInstance<FmModalWithComponent<ComponentT, any>>
implements OnInit, AfterViewInit {

  private _startLoading$ = new Subject<void>();
  private _stopLoading$ = new Subject<void>();

  public override ngOnInit(): void {
    super.ngOnInit();

    this._startLoading$
      .pipe(
        delay(10),
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

  protected _renderContent(): void {
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

  private _renderComponent(component: Type<ComponentT>): void {
    const modal = this.modal();
    const content$ = modal.content$;
    const componentRef = this._contentRef()?.createComponent(component, { injector: this._injector });
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
