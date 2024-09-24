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
  model, NgZone,
  OnChanges,
  OnDestroy,
  output,
  signal,
  SimpleChanges
} from '@angular/core';
import {filter, Subject, takeUntil} from "rxjs";

import {FlexiModalActionDirective} from "./directives/flexi-modal-action.directive";
import {FlexiModalHeaderDirective} from "./directives/flexi-modal-header.directive";
import {FlexiModalFooterDirective} from "./directives/flexi-modal-footer.directive";
import {FlexiModalBeforeCloseEvent} from "../../services/modals/events/flexi-modal-before-close.event";
import {FlexiModalBodyDirective} from "./directives/flexi-modal-body.directive";
import {FlexiModalWithTemplate} from "../../models/flexi-modal-with-template";
import {FlexiModalUpdateEvent} from "../../services/modals/events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "../../services/modals/events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "../../services/modals/events/flexi-modal-open.event";
import {FlexiModalsService} from "../../services/modals/flexi-modals.service";
import {
  IFlexiModalTemplateConfig,
  IFlexiModalTemplateOptions,
  TFlexiModalHeight,
  TFlexiModalScroll,
  TFlexiModalWidth
} from "../../services/modals/flexi-modals.definitions";

@Component({
  selector: 'fm-modal',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './flexi-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexiModalComponent implements DoCheck, OnChanges, AfterContentInit, OnDestroy {

  // Dependencies
  public service = inject(FlexiModalsService);
  public elementRef = inject(ElementRef);
  private _zone = inject(NgZone);

  // Inputs
  public opened = model<boolean>(false);
  public title = input<string>();
  public width = input<TFlexiModalWidth>();
  public height = input<TFlexiModalHeight>();
  public scroll = input<TFlexiModalScroll>();
  public border = input<boolean>();
  public rounding = input<number | boolean>();
  public closable = input<boolean>(true);
  public customId = input<string>('', { alias: 'id' });
  public data = input<any>();

  // Outputs
  public changeEvent = output<FlexiModalUpdateEvent>({ alias: 'change' });
  public openEvent = output<FlexiModalOpenEvent>({ alias: 'open' });
  public closeEvent = output<FlexiModalCloseEvent>({ alias: 'close' });
  public beforeCloseEvent = output<FlexiModalBeforeCloseEvent>({ alias: 'beforeClose' });

  // Signals
  public modal = signal<FlexiModalWithTemplate | null>(null);
  private _classes = signal<Array<string> | undefined>(undefined);
  private _classesChanged = signal<boolean>(false);

  // Queries
  private _actionsRef = contentChildren(FlexiModalActionDirective, { descendants: true });
  private _headerRef = contentChild(FlexiModalHeaderDirective);
  private _footerRef = contentChild(FlexiModalFooterDirective);
  private _bodyRef = contentChild(FlexiModalBodyDirective);

  // Private props
  private _destroy$ = new Subject<void>();


  // Computed

  public id = computed(() => {
    return this.modal()?.id || '';
  });

  private _bodyTpl = computed(() => {
    return this._bodyRef()?.templateRef;
  });

  private _headerTpl = computed(() => {
    return this._headerRef()?.templateRef;
  });

  private _footerTpl = computed(() => {
    return this._footerRef()?.templateRef;
  });

  private _actionsTpl = computed(() => {
    return this._actionsRef()?.length
      ? [...this._actionsRef()]
      : undefined;
  });


  // Effects

  private _modalChangeEffect = effect((onCleanup) => {
    if (!this.modal()) {
      return;
    }

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
          this.opened.set(false);
          this.modal.set(null);

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

  public ngDoCheck(): void {
    const classesStrNew = this.elementRef.nativeElement.className.replace(/\s+/g, ' ');
    const classesStrOld = (this._classes() || []).join(' ');
    const classes = classesStrNew.split(' ');

    if (classesStrNew !== classesStrOld) {
      this._classesChanged.set(true);
      this._classes.set(classes.length ? classes : undefined);
    }

    // Clean up the id attribute of the host element to prevent
    // it duplication in addition to appropriate rendered modal component instance
    this.elementRef.nativeElement.removeAttribute('id');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { opened } = changes;

    if (!opened?.currentValue) {
      return;

    } else if (opened?.currentValue && !this.modal()) {
      this._zone.runOutsideAngular(() => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);

          this._zone.run(() => {
            this.open();
          });
        });
      });

      return;
    }

    const options: IFlexiModalTemplateOptions<any> = {};
    const optionNames: Array<keyof IFlexiModalTemplateConfig<any>> = [
      'title', 'width', 'height', 'scroll', 'closable', 'data',
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
    if (this.opened()) {
      this.open();
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // Public methods

  public open(): void {
    const bodyTpl = this._bodyTpl();

    if (this.modal() || !bodyTpl) {
      return;
    }

    this._validateInputs();

    const modal = this.service.showTemplate(bodyTpl, {
      id: this.customId(),
      title: this.title(),
      width: this.width(),
      height: this.height(),
      scroll: this.scroll(),
      closable: this.closable(),
      aliveUntil: this._destroy$,
      headerTpl: this._headerTpl(),
      footerTpl: this._footerTpl(),
      actionsTpl: !this._footerTpl() ? this._actionsTpl() : undefined,
      classes: this._classes(),
      data: this.data(),
    });

    if (modal) {
      this.modal.set(modal);

      modal.content$
        .pipe(filter(Boolean))
        .subscribe(() => this.opened.set(true));
    }
  }

  public close(): void {
    if (this.opened()) {
      this.service.closeModal(this.id());
    }
  }


  // Internal implementation

  private _validateInputs(): void {
    if (this.title() && this._headerTpl()) {
      console.warn(
        'Specified both "*fmModalHeader" directive and the "title" property value ' +
        'at the same time for the displaying modal. ' +
        'The "*fmModalHeader" directive content takes precedence over the "title" property, ' +
        'so the "title" bound value was ignored.'
      );
    }

    if (this._footerTpl() && this._actionsTpl()?.length) {
      console.warn(
        'Specified both "*fmModalFooter" and "*fmModalAction" directives ' +
        'at the same time for the displaying modal. ' +
        'The "*fmModalFooter" directive content takes precedence over actions specified ' +
        'via the "*fmModalAction" directive, so the last one was ignored.'
      );
    }
  }
}
