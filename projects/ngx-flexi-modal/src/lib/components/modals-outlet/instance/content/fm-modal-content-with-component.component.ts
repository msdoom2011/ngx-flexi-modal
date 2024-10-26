import { AfterViewInit, ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

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
implements AfterViewInit {

  public ngAfterViewInit(): void {
    const modal = this.modal();
    const content = modal.content;

    if (content instanceof Promise) {
      const startLoadingDate = new Date();
      const minimumLoadingTime = 200;
      const instantLoadingTime = 50;

      const startLoadingTimeout = setTimeout(() => {
        clearTimeout(startLoadingTimeout);
        modal.startLoading(false);
      }, instantLoadingTime);

      content.then(component => {
        const actualLoadingTime = new Date().valueOf() - startLoadingDate.valueOf();
        const restLoadingTime = (
          actualLoadingTime < minimumLoadingTime
          && actualLoadingTime > instantLoadingTime
        ) ? minimumLoadingTime - actualLoadingTime : 0;

        if (!restLoadingTime) {
          clearTimeout(startLoadingTimeout);
        }

        const renderTimeout = setTimeout(() => {
          clearTimeout(renderTimeout);

          modal.markContentChanged();
          this._renderComponent(component);

          const stopLoadingTimeout = setTimeout(() => {
            clearTimeout(stopLoadingTimeout);
            modal.stopLoading();
          }, 400);
        }, restLoadingTime);
      });

      return;
    }

    this._renderComponent(content);
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
