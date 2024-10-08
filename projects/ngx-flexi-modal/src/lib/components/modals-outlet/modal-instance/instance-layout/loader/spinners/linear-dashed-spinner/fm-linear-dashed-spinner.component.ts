import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'fm-linear-dashed-spinner',
  standalone: true,
  imports: [],
  templateUrl: './fm-linear-dashed-spinner.component.html',
  styleUrl: './fm-linear-dashed-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-cy': 'linear-dashed-spinner',
  },
})
export class FmLinearDashedSpinnerComponent {}
