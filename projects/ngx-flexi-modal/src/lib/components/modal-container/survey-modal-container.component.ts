import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  InputSignal,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  viewChild
} from '@angular/core';
import {Subject, Subscription, takeUntil} from "rxjs";

import {SurveyModalsService} from "../../survey-modals.service";
import {ISurveyModalConfig} from "../../survey-modals.models";
import {SurveyModalButtons} from "./survey-modal-buttons";
import {findFocusableElements} from "../../tools/utils";

@Directive({
  host: {
    '[id]': 'id()',
    '[class]': 'classes()',
    '(window:keydown.Escape)': 'onEscapePress()',
    '(window:keydown)': 'onTabPress($event)',
  },
})
export abstract class SurveyModalContainerComponent<
  ConfigT extends ISurveyModalConfig<any>,
  ContentT
>
implements OnChanges, OnDestroy {

  // Dependencies
  public modalService = inject(SurveyModalsService);
  private _elementRef = inject(ElementRef<HTMLElement>);

  // Inputs
  public config!: InputSignal<ConfigT>;

  // Public props
  public buttons = new SurveyModalButtons(this.modalService, this);
  public contentRef = viewChild<ContentT>('content');

  // Private props
  private _destroy$ = new Subject<void>();
  private _destroySubscription!: Subscription;


  // Computed

  public id = computed(() => {
    return <string>this.config().id;
  });

  public index = computed(() => {
    return this.modalService.modals()
      .findIndex(modalConfig => modalConfig.id === this.id());
  });

  public classes = computed(() => {
    return [
      'sw-modal',
      ...(this.config().classes || [])
    ];
  });

  public isActive = computed(() => {
    return this.modalService.modals()[this.modalService.modals().length - 1]?.id === this.id();
  });

  private _focusableElements = computed(() => {
    return findFocusableElements(this._elementRef.nativeElement);
  });


  // Effects

  private _isActiveEffect = effect(() => {
    const focusInModal = this._elementRef.nativeElement.contains(document.activeElement);
    const isActive = this.isActive();

    if (!isActive && focusInModal) {
      (<any>document.activeElement).blur();

    } else if (isActive && !focusInModal) {
      this._focusableElements()[0]?.focus();
    }
  });


  // Lifecycle hooks

  public ngOnChanges(changes: SimpleChanges) {
    const { config } = changes;

    if (config?.currentValue) {
      this._initialize();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Public methods

  public close(): void {
    this.modalService.closeModal(this.id());
  }


  // Callbacks

  public onEscapePress(): void {
    if (this.isActive() && this.config()?.closable) {
      this.close();
    }
  }

  public onTabPress($event: KeyboardEvent): void {
    if (!this.isActive() || $event.key !== 'Tab') {
      return;
    }

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


  // Internal implementation

  private _initialize(): void {
    const modalDestroy$ = this.config().aliveUntil;

    if (!modalDestroy$) {
      return;
    }

    if (this._destroySubscription) {
      this._destroySubscription.unsubscribe();
    }

    this._destroySubscription = modalDestroy$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.close());
  }
}
