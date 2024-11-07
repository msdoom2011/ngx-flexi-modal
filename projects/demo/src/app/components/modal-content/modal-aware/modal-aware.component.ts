import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'fm-app-modal-aware',
  standalone: true,
  imports: [],
  templateUrl: './modal-aware.component.html',
  styleUrl: './modal-aware.component.scss'
})
export class ModalAwareComponent implements OnInit, OnDestroy {

  public ngOnInit() {
    console.log('SERVICE-CREATED MODAL INITIALIZED!!!');
  }

  public ngOnDestroy(): void {
    console.log('SERVICE-CREATED MODAL DESTROYED!!!');
  }
}
