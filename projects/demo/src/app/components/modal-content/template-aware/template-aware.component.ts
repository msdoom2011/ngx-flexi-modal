import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {FlexiModalComponent} from 'ngx-flexi-modal';

@Component({
  selector: 'fm-app-template-aware',
  standalone: true,
  imports: [],
  templateUrl: './template-aware.component.html',
  styleUrl: './template-aware.component.scss'
})
export class TemplateAwareComponent implements OnInit, OnDestroy {

  public modal = input.required<FlexiModalComponent>();

  public ngOnInit() {
    console.log('TEMPLATE MODAL INITIALIZED!!!');

    this.modal().startLoading();
  }

  public ngOnDestroy(): void {
    console.log('TEMPLATE MODAL DESTROYED!!!');
  }

}
