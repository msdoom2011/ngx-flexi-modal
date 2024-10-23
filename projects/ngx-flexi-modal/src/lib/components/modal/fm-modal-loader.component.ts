import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core';

import { FmModalComponent } from './fm-modal.component';

@Component({
  selector: 'fm-modal-loader',
  standalone: true,
  template: '',
  styles: ':host { display: none; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmModalLoaderComponent implements OnInit, OnDestroy {

  // Dependencies
  private _modalComponent = inject(FmModalComponent);

  // Inputs
  public animation = input<boolean>(false);

  public ngOnInit(): void {
    this._modalComponent.startLoading(this.animation());
  }

  public ngOnDestroy(): void {
    this._modalComponent.stopLoading();
  }
}
