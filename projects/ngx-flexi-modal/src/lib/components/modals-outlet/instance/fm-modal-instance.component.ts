import {
  afterRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { filter, fromEvent, Subject, Subscription, takeUntil } from 'rxjs';

import { FmModalContentWithComponentComponent } from './content/fm-modal-content-with-component.component';
import { FmModalContentWithTemplateComponent } from './content/fm-modal-content-with-template.component';
import { FmModalInstanceHeaderComponent } from './layout/header/fm-modal-instance-header.component';
import { FmModalInstanceFooterComponent } from './layout/footer/fm-modal-instance-footer.component';
import { FmModalInstanceLayoutComponent } from './layout/fm-modal-instance-layout.component';
import { FlexiModalsThemeService } from '../../../services/theme/flexi-modals-theme.service';
import { FM_MODAL_HEADER_ACTION_CLASS } from './layout/fm-modal-instance-layout.constants';
import { FlexiModalsService } from '../../../services/modals/flexi-modals.service';
import { FmModalEventType } from '../../../services/modals/flexi-modals.constants';
import { TFmModalEvent } from '../../../services/modals/flexi-modals.definitions';
import { findFocusableElements } from '../../../tools/utils';
import { FmModal } from '../../../models/fm-modal';

@Component({
  selector: 'fm-modal-instance',
  templateUrl: './fm-modal-instance.component.html',
  styleUrl: './fm-modal-instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FmModalInstanceLayoutComponent,
    FmModalInstanceHeaderComponent,
    FmModalInstanceFooterComponent,
    FmModalContentWithComponentComponent,
    FmModalContentWithTemplateComponent,
  ],
  host: {
    'data-cy': 'modal',
    '[id]': 'id()',
    '[class]': 'hostClasses()',
  },
})
export class FmModalInstanceComponent<
  ModalT extends FmModal<any, any> = FmModal<any, any>
>
implements OnInit, OnDestroy {

  // Dependencies
  protected readonly _service = inject(FlexiModalsService);
  protected readonly _themes = inject(FlexiModalsThemeService);
  protected readonly _elementRef = inject(ElementRef<HTMLElement>);
  protected readonly _injector = inject(Injector);
  protected readonly _zone = inject(NgZone);

  // Inputs

  /**
   * Specifying the explicit type of the 'modal' property is necessary due to issue
   * of not recognizing correctly the specified modal type in the child component templates
   */
  public readonly modal: InputSignal<ModalT> = input.required<ModalT>();

  // Signals
  private readonly _focusableElements = signal<Array<Element & { focus: () => any }>>([]);

  // Public props
  protected readonly _viewportRef = viewChild.required('viewport', { read: ElementRef<HTMLElement> });

  // Private props
  protected readonly _destroy$ = new Subject<void>();
  private _modalDestroySubscription: Subscription | null = null;
  private _focusableElementsUpdateRequested = false;


  // Computed

  public readonly id = computed<string>(() => {
    return this.modal().id();
  });

  public readonly index = computed<number>(() => {
    return this._service.modals().findIndex(modal => modal.id() === this.id());
  });

  public readonly hostClasses = computed<Array<string>>(() => {
    return [
      'fm-modal-instance',
      ...(this.modal().config().classes || []),
      ...(this._themes.isThemeExist(<string>this.modal().config().theme)
        ? [ this._themes.getThemeClass(this.modal().config().theme || '') ]
        : []
      ),
    ];
  });


  // Effects

  private readonly _activeUntilEffect = effect(() => {
    const modalDestroy$ = this.modal().config().openUntil;

    if (!modalDestroy$) {
      return;
    }

    if (this._modalDestroySubscription) {
      this._modalDestroySubscription.unsubscribe();
    }

    this._modalDestroySubscription = modalDestroy$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.modal().close());
  });

  private readonly _focusableElementsEffect = effect(() => {
    if (!this.modal().ready()) {
      return;
    }

    const focusInModal = this._elementRef.nativeElement.contains(document.activeElement);
    const focusableElements = this._focusableElements();
    const isActive = this.modal().active();

    if (!isActive && focusInModal) {
      return (<any>document.activeElement).blur();

    } else if (!isActive || focusInModal) {
      return;
    }

    for (const element of focusableElements) {
      if (element.matches('[autofocus], [fm-autofocus="true"]')) {
        element.focus();

        return;
      }
    }

    const viewportBox = this._viewportRef().nativeElement.getBoundingClientRect();
    let focusSucceeded = false;

    for (const element of focusableElements) {
      if (!element.classList.contains(FM_MODAL_HEADER_ACTION_CLASS)) {
        const elementBox = element.getBoundingClientRect();

        if (viewportBox.height < elementBox.top) {
          continue;
        }

        focusSucceeded = true;
        element.focus();

        break;
      }
    }

    if (!focusSucceeded && focusableElements.length) {
      focusableElements[0].focus();

    } else if (!focusableElements.length) {
      (<any>document.activeElement).blur();
    }
  });


  // Lifecycle hooks

  public ngOnInit(): void {
    this._initializeModalListeners();
    this._initializeOnEscapeKeydown();
    this._initializeOnTabKeydown();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public ngAfterRender = afterRender({ read: () => {
    if (this.modal().ready() && this._focusableElementsUpdateRequested) {
      this._focusableElementsUpdateRequested = false;
      this._focusableElements.set(findFocusableElements(this._elementRef.nativeElement));
    }
  }});


  // Internal implementation

  protected _initializeModalListeners(): void {
    this.modal().events$
      .pipe(
        filter(() => this.modal().active()),
        takeUntil(this._destroy$)
      )
      .subscribe(($event: TFmModalEvent) => {
        switch ($event.type) {
          case FmModalEventType.Ready:
          case FmModalEventType.ContentChange:
            this._focusableElementsUpdateRequested = true;
            break;

          case FmModalEventType.Update: {
            const { actions, actionsTpl, headerTpl, footerTpl } = $event.changes;

            if (actions || actionsTpl || headerTpl || footerTpl) {
              this._focusableElementsUpdateRequested = true;
            }
          }
        }
      });
  }

  protected _initializeOnEscapeKeydown(): void {
    this._zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(($event: KeyboardEvent) => {
            return !!(
              $event.key === 'Escape'
              && this.modal().active()
              && this.modal()?.config().closable
            );
          }),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this.modal().close();
        });
    });
  }

  protected _initializeOnTabKeydown(): void {
    this._zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(window, 'keydown')
        .pipe(
          filter(($event: KeyboardEvent) => {
            return $event.key === 'Tab' && this.modal().active();
          }),
          takeUntil(this._destroy$),
        )
        .subscribe(($event: KeyboardEvent) => {
          this._onTabKeydownCallback($event);
        });
    });
  }

  protected _onTabKeydownCallback($event: KeyboardEvent): void {
    const elements = this._focusableElements();

    if (!elements.length) {
      $event.preventDefault();

      return;
    }

    const focusedElement = <Element & { focus: () => any }>document.activeElement;
    let indexToFocus = elements.indexOf(focusedElement);

    if (indexToFocus < 0) {
      $event.preventDefault();
      elements[0].focus();

      return;
    }

    indexToFocus += !$event.shiftKey ? 1 : -1;

    if (!elements[indexToFocus]) {
      $event.preventDefault();

      if (indexToFocus >= elements.length) {
        indexToFocus = 0;

      } else if (indexToFocus < 0) {
        indexToFocus = elements.length - 1;
      }

      elements[indexToFocus].focus();
    }
  }
}
