import {Component, inject, OnInit, signal} from '@angular/core';
import {
  FlexiModalButtonDirective,
  FlexiModalButtonsComponent,
  FlexiModalComponent,
  FlexiModalsOutletComponent,
  FlexiModalsService
} from "ngx-flexi-modal";
import {filter, Observable, Subject} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FlexiModalsOutletComponent,
    FlexiModalButtonsComponent,
    FlexiModalComponent,
    FlexiModalButtonDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private modalsService = inject<FlexiModalsService>(FlexiModalsService);

  public modalVisible = signal(false);
  public buttonVisible = signal(true);


  public ngOnInit(): void {
    const observable = this.getObservable();

    observable.subscribe(() => { console.log(11111)});
    observable.subscribe((evt) => { console.log(22222); evt.prevented = true });
    observable.subscribe(() => { console.log(33333)});
  }

  private getObservable(): Observable<{ prevented: boolean }> {
    const observable = new Subject<{ prevented: boolean }>();

    setTimeout(() => {
      observable.next({
        prevented: false,
      });
    }, 500);

    return observable
      .pipe(filter(evt => !evt.prevented));
  }

  public openModal(): void {
    // this.modalVisible.set(true);

    this.modalsService.show('error', {
      title: 'Error: Network issues',
      message: [
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
        'Oops! Something went wrong!',
      ],
      onClose: () => {
        alert('CLOSE!!!');
      },
      // messageAlign: 'left',
      // icon: null
    });
  }
}
