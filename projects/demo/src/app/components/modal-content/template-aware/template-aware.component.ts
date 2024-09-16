import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-template-aware',
  standalone: true,
  imports: [],
  templateUrl: './template-aware.component.html',
  styleUrl: './template-aware.component.scss'
})
export class TemplateAwareComponent implements OnInit, OnDestroy {

  public ngOnInit() {
    console.log('TEMPLATE MODAL INITIALIZED!!!');
  }

  public ngOnDestroy(): void {
    console.log('TEMPLATE MODAL DESTROYED!!!');
  }

}
