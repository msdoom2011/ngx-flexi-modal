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

import {FlexiModalButtonDirective} from "../../directives/flexi-modal-button/flexi-modal-button.directive";
import {FlexiModalButtonsComponent} from "./sections/section-types/flexi-modal-buttons.component";
import {FlexiModalHeaderComponent} from "./sections/section-types/flexi-modal-header.component";
import {FlexiModalFooterComponent} from "./sections/section-types/flexi-modal-footer.component";
import {FlexiModalBeforeCloseEvent} from "../../events/flexi-modal-before-close.event";
import {FlexiModalUpdateEvent} from "../../events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "../../events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "../../events/flexi-modal-open.event";
import {FlexiModalTemplate} from "../../modals/flexi-modal-template";
import {FlexiModalsService} from "../../flexi-modals.service";
import {
  IFlexiTemplateModalCreateOptions,
  TFlexiModalHeight,
  TFlexiModalScroll,
  TFlexiModalWidth
} from "../../flexi-modals.models";

@Component({
  selector: 'fm-modal',
  standalone: true,
  imports: [],
  templateUrl: './flexi-modal.component.html',
  styleUrl: './flexi-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponent implements OnInit, DoCheck, OnChanges, AfterContentInit, OnDestroy {

  // Dependencies
  public service = inject(FlexiModalsService);
  public elementRef = inject(ElementRef<any>);

  // Inputs
  public title = input<string>();
  public width = input<TFlexiModalWidth>();
  public height = input<TFlexiModalHeight>();
  public scroll = input<TFlexiModalScroll>();
  public closable = input<boolean>(true);
  public customId = input<string>('', { alias: 'id' });

  // Outputs
  public changeEvent = output<FlexiModalUpdateEvent>({ alias: 'change' });
  public openEvent = output<FlexiModalOpenEvent>({ alias: 'open' });
  public closeEvent = output<FlexiModalCloseEvent>({ alias: 'close' });
  public beforeCloseEvent = output<FlexiModalBeforeCloseEvent>({ alias: 'beforeClose' });

  // Signals
  public modal = signal<FlexiModalTemplate | null>(null);
  private _classes = signal<Array<string> | undefined>(undefined);
  private _classesChanged = signal<boolean>(false);

  // Queries
  private _buttonItemsRef = contentChildren(FlexiModalButtonDirective, { descendants: true });
  private _buttonsRef = contentChild(FlexiModalButtonsComponent);
  private _headerRef = contentChild(FlexiModalHeaderComponent);
  private _footerRef = contentChild(FlexiModalFooterComponent);
  private _bodyRef = viewChild.required<TemplateRef<any>>('body');

  // Private props
  private _destroy$ = new Subject<void>();


  // Computed

  public id = computed(() => {
    return this.modal()?.id || '';
  });

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
    const subscription = this.service.events$
      .pipe(
        filter($event => $event.id === this.id()),
        takeUntil(this._destroy$)
      )
      .subscribe($event => {
        if ($event instanceof FlexiModalOpenEvent) {
          this.openEvent.emit($event);

        } else if ($event instanceof FlexiModalBeforeCloseEvent) {
          this.beforeCloseEvent.emit($event);

        } else if ($event instanceof FlexiModalCloseEvent) {
          this.closeEvent.emit($event);

        } else if ($event instanceof FlexiModalUpdateEvent) {
          this.changeEvent.emit(<FlexiModalUpdateEvent>$event);
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
    this.service.updateModal(this.id(), {
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
        'To make it callable specify an "id" property to your "<fm-modal />" component'
      );
    }
  }

  public ngDoCheck(): void {
    const classesStrNew = this.elementRef.nativeElement.className.replace(/\s+/g, ' ');
    const classesStrOld = (this._classes() || []).join(' ');
    const classes = classesStrNew.split(' ');

    if (classesStrNew !== classesStrOld) {
      this._classesChanged.set(true);
      this._classes.set(classes.length ? classes : undefined);
    }

    // Clean up the id attribute of the host element to prevent
    // it duplication in addition to appropriate rendered modal container
    this.elementRef.nativeElement.removeAttribute('id');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const options: Partial<IFlexiTemplateModalCreateOptions<any>> = {};
    const optionNames: Array<keyof IFlexiTemplateModalCreateOptions<any>> = [
      'title', 'width', 'height', 'scroll', 'closable'
    ];

    for (const optionName of optionNames) {
      if (changes[optionName]) {
        options[optionName] = changes[optionName].currentValue;
      }
    }

    if (Object.keys(options).length > 0) {
      this.service.updateModal(this.id(), options);
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
    this.service.closeModal(this.id());
  }


  // Internal implementation

  private _show(): void {
    this._validateInputs();

    this.service.showTemplate(this._bodyRef(), {
      id: this.customId(),
      title: this.title(),
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
      .pipe(
        filter(Boolean),
        take(1),
      )
      .subscribe((modal) => {
        this.modal.set(modal);
      });
  }

  private _validateInputs(): void {
    if (this.title() && this._headerTpl()) {
      console.warn(
        'Specified both "<fm-modal-header />" component and the "title" property value ' +
        'at the same time for the displaying modal. ' +
        'The "<fm-modal-header />" takes precedence over the "title" property, ' +
        'so the "title" bound value was ignored.'
      );
    }

    if (this._footerTpl() && this._buttonsRef()) {
      console.warn(
        'Specified both "<fm-modal-footer />" and "<fm-modal-buttons />" components ' +
        'at the same time for the displaying modal. ' +
        'The "<fm-modal-footer />" component takes precedence over the "<fm-modal-buttons />" component, ' +
        'so the last one was ignored.'
      );
    }
  }
}
