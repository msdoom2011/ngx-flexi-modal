import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DoCheck,
  effect,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
  TemplateRef,
  viewChild
} from '@angular/core';
import {filter, Subject, take, takeUntil} from "rxjs";

import {SurveyModalButtonDirective} from "../../directives/survey-modal-button/survey-modal-button.directive";
import {SurveyModalButtonsComponent} from "./sections/section-types/survey-modal-buttons.component";
import {SurveyModalHeaderComponent} from "./sections/section-types/survey-modal-header.component";
import {SurveyModalFooterComponent} from "./sections/section-types/survey-modal-footer.component";
import {
  ISurveyModalButtonConfig,
  ISurveyModalCreateOptions,
  TSurveyModalHeight, TSurveyModalScroll,
  TSurveyModalWidth
} from "../../survey-modals.models";
import {SurveyModalUpdateEvent} from "../../events/survey-modal-update.event";
import {SurveyModalEventType} from "../../survey-modals.constants";
import {SurveyModalEvent} from "../../events/survey-modal.event";
import {SurveyModalsService} from "../../survey-modals.service";

@Component({
  selector: 'sw-modal',
  standalone: true,
  imports: [],
  templateUrl: './survey-modal.component.html',
  styleUrl: './survey-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyModalComponent implements OnInit, DoCheck, OnChanges, AfterContentInit, OnDestroy {

  // Dependencies
  private _modalService = inject(SurveyModalsService);
  private _elementRef = inject(ElementRef<any>);

  // Inputs
  public title = input<string>();
  public width = input<TSurveyModalWidth>();
  public height = input<TSurveyModalHeight>();
  public scroll = input<TSurveyModalScroll>();
  public closable = input<boolean>(true);
  public buttons = input<Array<ISurveyModalButtonConfig>>();
  public customId = input<string>('', { alias: 'id' });

  // Outputs
  public changeEvent = output<SurveyModalUpdateEvent>({ alias: 'change' });
  public openEvent = output<SurveyModalEvent>({ alias: 'open' });
  public closeEvent = output<SurveyModalEvent>({ alias: 'close' });
  public beforeCloseEvent = output<SurveyModalEvent>({ alias: 'beforeClose' });

  // Signals
  public id = signal<string>('');
  private _classes = signal<Array<string> | undefined>(undefined);
  private _classesChanged = signal<boolean>(false);

  // Queries
  private _buttonItemsRef = contentChildren(SurveyModalButtonDirective, { descendants: true });
  private _buttonsRef = contentChild(SurveyModalButtonsComponent);
  private _headerRef = contentChild(SurveyModalHeaderComponent);
  private _footerRef = contentChild(SurveyModalFooterComponent);
  private _bodyRef = viewChild.required<TemplateRef<any>>('body');

  // Private props
  private _destroy$ = new Subject<void>();


  // Computed

  private _headerTpl = computed(() => {
    return this._headerRef()?.templateRef();
  });

  private _footerTpl = computed(() => {
    return this._footerRef()?.templateRef();
  });

  private _buttonsTpl = computed(() => {
    return this._buttonItemsRef()?.length
      ? [...this._buttonItemsRef()]
      : undefined;
  });


  // Effects

  private _idChangeEffect = effect((onCleanup) => {
    const subscription = this._modalService.events$
      .pipe(
        filter($event => $event.id === this.id()),
        takeUntil(this._destroy$)
      )
      .subscribe($event => {
        switch ($event.type) {
          case SurveyModalEventType.Open:
            this.openEvent.emit($event);
            break;

          case SurveyModalEventType.BeforeClose:
            this.beforeCloseEvent.emit($event);
            break;

          case SurveyModalEventType.Close:
            this.closeEvent.emit($event);
            break;

          case SurveyModalEventType.Update:
            this.changeEvent.emit(<SurveyModalUpdateEvent>$event);
            break;
        }
      });

    return onCleanup(() => {
      subscription.unsubscribe();
    });
  });

  private _classesChangeEffect = effect(() => {
    if (!this._classesChanged()) {
      return;
    }

    this._classesChanged.set(false);
    this._modalService.updateModal(this.id(), {
      classes: this._classes(),
    });
  }, {
    allowSignalWrites: true,
  });


  // Lifecycle Hooks

  public ngOnInit(): void {
    // @ts-ignore
    if (!this.customId() && this.openEvent.listeners?.length) {
      console.warn(
        'Your "(open)" event listener will never be invoked. ' +
        'To make it callable specify an "id" property to your "<sw-modal />" component'
      );
    }
  }

  public ngDoCheck(): void {
    const classesStrNew = this._elementRef.nativeElement.className.replace(/\s+/g, ' ');
    const classesStrOld = (this._classes() || []).join(' ');
    const classes = classesStrNew.split(' ');

    if (classesStrNew !== classesStrOld) {
      this._classesChanged.set(true);
      this._classes.set(classes.length ? classes : undefined);
    }

    // Clean up the id attribute of the host element to prevent
    // it duplication in addition to appropriate rendered modal container
    this._elementRef.nativeElement.removeAttribute('id');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { customId, title, width, height, scroll, closable, buttons } = changes;
    const options: Partial<ISurveyModalCreateOptions<any>> = {};

    if (customId) {
      this.id.set(customId.currentValue);
    }

    if (title) {
      options.title = title.currentValue;
    }

    if (width) {
      options.width = width.currentValue;
    }

    if (height) {
      options.height = height.currentValue;
    }

    if (scroll) {
      options.scroll = scroll.currentValue;
    }

    if (closable) {
      options.closable = closable.currentValue;
    }

    if (buttons) {
      options.buttons = buttons.currentValue;
    }

    if (Object.keys(options).length > 0) {
      this._modalService.updateModal(this.id(), options);
    }
  }

  public ngAfterContentInit(): void {
    this._show();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Public methods

  public close(): void {
    this._modalService.closeModal(this.id());
  }


  // Internal implementation

  private _show(): void {
    this._validateInputs();

    this._modalService.showTemplate(this._bodyRef(), {
      id: this.customId(),
      title: this.title(),
      buttons: this.buttons(),
      width: this.width(),
      height: this.height(),
      scroll: this.scroll(),
      closable: this.closable(),
      aliveUntil: this._destroy$,
      headerTpl: this._headerTpl(),
      footerTpl: this._footerTpl(),
      buttonsTpl: this._buttonsRef() && !this._footerTpl()
        ? this._buttonsTpl()
        : undefined,
      classes: this._classes(),
    })
      .pipe(take(1))
      .subscribe((modal) => {
        this.id.set(modal.id());
      });
  }

  private _validateInputs(): void {
    if (this.title() && this._headerTpl()) {
      console.warn(
        'Specified both "<sw-modal-header />" component and the "title" property value ' +
        'at the same time for the displaying modal. ' +
        'The "<sw-modal-header />" takes precedence over the "title" property, ' +
        'so the "title" bound value was ignored.'
      );
    }

    if (this._footerTpl() && this._buttonsRef()) {
      console.warn(
        'Specified both "<sw-modal-footer />" and "<sw-modal-buttons />" components ' +
        'at the same time for the displaying modal. ' +
        'The "<sw-modal-footer />" component takes precedence over the "<sw-modal-buttons />" component, ' +
        'so the last one was ignored.'
      );
    }

    if (this.buttons() && (this._buttonsRef() || this._footerTpl())) {
      const componentName = this._footerTpl()
        ? '<sw-modal-footer />'
        : '<sw-modal-buttons />';

      console.warn(
        `Specified both "${componentName}" component and the "buttons" property value ` +
        `at the same time for the displaying modal. ` +
        `The "${componentName}" takes precedence over the "buttons" property, ` +
        `so the "buttons" bound value was ignored.`
      );
    }
  }
}
