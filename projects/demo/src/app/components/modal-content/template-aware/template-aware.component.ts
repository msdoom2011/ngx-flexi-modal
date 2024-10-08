import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {FmModalComponent} from 'ngx-flexi-modal';

@Component({
  selector: 'fm-app-template-aware',
  standalone: true,
  imports: [],
  templateUrl: './template-aware.component.html',
  styleUrl: './template-aware.component.scss'
})
export class TemplateAwareComponent implements OnInit, OnDestroy {

  public modal = input.required<FmModalComponent>();

  public ngOnInit() {
    console.log('TEMPLATE MODAL INITIALIZED!!!');

    // setTimeout(() => {
    //   this.modal().startLoading();
    // }, 1000);
  }

  public ngOnDestroy(): void {
    console.log('TEMPLATE MODAL DESTROYED!!!');
  }

}
