import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnChanges,
  OutputEmitterRef,
  SimpleChanges,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import {
  FmModalsOutletComponent,
} from '../../../projects/ngx-flexi-modal/src/lib/components/modals-outlet/fm-modals-outlet.component';
import { FmModalComponent } from '../../../projects/ngx-flexi-modal/src/lib/components/modal/fm-modal.component';
import { ModalWithTemplate } from './modal-with-template';

@Component({
  selector: 'cy-modal-with-template-root',
  templateUrl: './modal-with-template-root.component.html',
  standalone: true,
  imports: [
    NgComponentOutlet,
    FmModalsOutletComponent,
  ],
})
export class ModalWithTemplateRootComponent<C extends ModalWithTemplate> implements OnChanges, AfterViewInit {

  // Inputs

  @Input({ required: true })
  public component!: Type<C>;

  @Input()
  public inputs: Partial<{[ P in keyof C]: C[P] }> = {};

  @Input()
  public outputs: Partial<{[ P in keyof C]: (value: any) => void }> = {};

  // Queries
  public placeholderRef = viewChild.required<string, ViewContainerRef>('placeholder', { read: ViewContainerRef });

  // Public props
  public modal!: FmModalComponent;

  // Private props
  private _componentRef!: ComponentRef<C>;


  // Lifecycle hooks

  public ngOnChanges(changes: SimpleChanges): void {
    const { component, inputs, outputs } = changes;

    if (!this._componentRef) {
      return;
    }

    if (component) {
      throw new Error('Component can\'t be changed after initialization!');
    }

    if (inputs) {
      this._updateInputs();
    }

    if (outputs) {
      this._updateOutputs();
    }

    this._componentRef.changeDetectorRef.detectChanges();
  }

  public ngAfterViewInit(): void {
    if (!this.component) {
      throw new Error('Component is required!');
    }

    this._componentRef = this.placeholderRef().createComponent(this.component);

    this._updateInputs();
    this._updateOutputs();
    this._componentRef.changeDetectorRef.detectChanges();

    this.modal = this._componentRef.instance.modal();
  }


  // Private methods

  private _updateInputs(): void {
    for (const inputName in this.inputs) {
      if (Object.prototype.hasOwnProperty.call(this.inputs, inputName)) {
        this._componentRef.setInput(inputName, this.inputs[inputName]);
      }
    }
  }

  private _updateOutputs(): void {
    const component = this._componentRef.instance;

    for (const outputName in this.outputs) {
      if (Object.prototype.hasOwnProperty.call(this.outputs, outputName)) {
        (<OutputEmitterRef<any>>component[<keyof C>outputName])
          .subscribe(<(value: any) => void>this.outputs[outputName]);
      }
    }
  }
}
