import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'fm-round-dashed-spinner',
  standalone: true,
  imports: [],
  templateUrl: './fm-round-dashed-spinner.component.html',
  styleUrl: './fm-round-dashed-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'round-dashed-spinner',
  }
})
export class FmRoundDashedSpinnerComponent {}
