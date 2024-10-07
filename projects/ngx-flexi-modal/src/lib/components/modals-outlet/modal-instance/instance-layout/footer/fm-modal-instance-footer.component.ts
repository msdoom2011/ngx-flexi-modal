import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'fm-modal-instance-footer',
  standalone: true,
  imports: [],
  templateUrl: './fm-modal-instance-footer.component.html',
  styleUrl: './fm-modal-instance-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'modal-footer-wrapper',
  },
})
export class FmModalInstanceFooterComponent {}
