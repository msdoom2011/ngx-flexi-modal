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
  model,
  OnChanges,
  OnDestroy,
  output,
  signal,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {filter, Subject, takeUntil} from "rxjs";

import {FlexiModalBeforeCloseEvent} from "../../services/modals/events/flexi-modal-before-close.event";
import {FlexiModalUpdateEvent} from "../../services/modals/events/flexi-modal-update.event";
import {FlexiModalCloseEvent} from "../../services/modals/events/flexi-modal-close.event";
import {FlexiModalOpenEvent} from "../../services/modals/events/flexi-modal-open.event";
import {FlexiModalActionDirective} from "./directives/flexi-modal-action.directive";
import {FlexiModalHeaderDirective} from "./directives/flexi-modal-header.directive";
import {FlexiModalFooterDirective} from "./directives/flexi-modal-footer.directive";
import {FlexiModalBodyDirective} from "./directives/flexi-modal-body.directive";
import {FlexiModalWithTemplate} from "../../models/flexi-modal-with-template";
import {FlexiModalsService} from "../../services/modals/flexi-modals.service";
import {
  IFlexiModalTemplateConfig,
  IFlexiModalTemplateOptions,
  TFlexiModalHeight,
  TFlexiModalOpeningAnimation,
  TFlexiModalPosition,
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
  public readonly service = inject(FlexiModalsService);
  public readonly elementRef = inject(ElementRef);

  // Inputs
  public readonly _id = input<string | undefined>(undefined, { alias: 'id' });
  public readonly _opened = model<boolean>(false, { alias: 'opened' });
  public readonly _maximized = model<boolean | undefined>(undefined, { alias: 'maximized' });
  public readonly _title = input<string | undefined>(undefined, { alias: 'title' });
  public readonly _animation = input<TFlexiModalOpeningAnimation | undefined>(undefined, { alias: 'animation' });
  public readonly _position = input<TFlexiModalPosition | undefined>(undefined, { alias: 'position' });
  public readonly _width = input<TFlexiModalWidth | undefined>(undefined, { alias: 'width' });
  public readonly _height = input<TFlexiModalHeight | undefined>(undefined, { alias: 'height' });
  public readonly _scroll = input<TFlexiModalScroll | undefined>(undefined, { alias: 'scroll' });
  public readonly _rounding = input<number | boolean | undefined>(undefined, { alias: 'rounding' });
  public readonly _closable = input<boolean | undefined>(undefined, { alias: 'closable' });
  public readonly _maximizable = input<boolean | undefined>(undefined, { alias: 'maximizable' });
  public readonly _data = input<any>(undefined, { alias: 'data' });

  // Outputs
  public readonly changeEvent = output<FlexiModalUpdateEvent>({ alias: 'change' });
  public readonly openEvent = output<FlexiModalOpenEvent>({ alias: 'open' });
  public readonly closeEvent = output<FlexiModalCloseEvent>({ alias: 'close' });
  public readonly beforeCloseEvent = output<FlexiModalBeforeCloseEvent>({ alias: 'beforeClose' });

  // Signals
  public readonly modal = signal<FlexiModalWithTemplate | null>(null);
  private readonly _classes = signal<Array<string> | undefined>(undefined);
  private readonly _classesChanged = signal<boolean>(false);

  // Queries
  private readonly _actionsRef = contentChildren(FlexiModalActionDirective, { descendants: true });
  private readonly _headerRef = contentChild(FlexiModalHeaderDirective);
  private readonly _footerRef = contentChild(FlexiModalFooterDirective);
  private readonly _bodyRef = contentChild(FlexiModalBodyDirective);

  // Private props
  private readonly _destroy$ = new Subject<void>();


  // Computed

  public readonly id = computed<string>(() => {
    return this.modal()?.id() || '';
  });

  public readonly opened = computed<boolean>(() => {
    return this._opened();
  });

  public readonly maximized = computed<boolean>(() => {
    return !!this.modal()?.config().maximized;
  });

  public readonly loading = computed<boolean>(() => {
    return !!this.modal()?.loading();
  });

  private readonly _bodyTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._bodyRef()?.templateRef;
  });

  private readonly _headerTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._headerRef()?.templateRef;
  });

  private readonly _footerTpl = computed<TemplateRef<any> | undefined>(() => {
    return this._footerRef()?.templateRef;
  });

  private readonly _actionsTpl = computed<Array<FlexiModalActionDirective> | undefined>(() => {
    return this._actionsRef()?.length
      ? [...this._actionsRef()]
      : undefined;
  });


  // Effects

  private readonly _modalChangeEffect = effect((onCleanup) => {
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
          this._opened.set(false);
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

  private readonly _classesChangeEffect = effect(() => {
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
    const { _opened } = changes;

    if (!_opened?.currentValue) {
      return;

    } else if (!this.modal()) {
      this.open();

      return;
    }

    const options: IFlexiModalTemplateOptions<any> = {};
    const optionNames: Array<
      keyof IFlexiModalTemplateConfig<any>
      | { [inputName: string]: keyof IFlexiModalTemplateConfig<any> }
    > = [
      { _maximized: 'maximized' },
      { _title: 'title' },
      { _animation: 'animation' },
      { _position: 'position' },
      { _width: 'width' },
      { _height: 'height' },
      { _scroll: 'scroll' },
      { _closable: 'closable' },
      { _maximizable: 'maximizable' },
      { _data: 'data' },
    ];

    for (const item of optionNames) {
      const inputName = typeof item === 'object' ? Object.keys(item)[0] : item;
      const optionName = typeof item === 'object' ? item[inputName] : item;

      if (changes[inputName]) {
        options[optionName] = changes[inputName].currentValue;
      }
    }

    if (Object.keys(options).length > 0) {
      this.service.updateModal(this.id(), options);
    }
  }

  public ngAfterContentInit(): void {
    if (this._opened()) {
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
      id: this._id(),
      title: this._title(),
      animation: this._animation(),
      position: this._position(),
      width: this._width(),
      height: this._height(),
      scroll: this._scroll(),
      maximized: this._maximized(),
      closable: this._closable(),
      maximizable: this._maximizable(),
      aliveUntil: this._destroy$,
      headerTpl: this._headerTpl(),
      footerTpl: this._footerTpl(),
      actionsTpl: !this._footerTpl() ? this._actionsTpl() : undefined,
      classes: this._classes(),
      data: this._data(),
    });

    if (modal) {
      this.modal.set(modal);

      modal.content$
        .pipe(filter(Boolean))
        .subscribe(() => this._opened.set(true));
    }
  }

  public close(): void {
    if (this._opened()) {
      this.service.closeModal(this.id());
    }
  }

  public maximize(): void {
    this.modal()?.maximize();
  }

  public minimize(): void {
    this.modal()?.minimize();
  }

  public toggleMaximize(): void {
    this.modal()?.toggleMaximize();
  }

  public startLoading(animation: boolean = true): void {
    this.modal()?.startLoading(animation);
  }

  public stopLoading(animation: boolean = true): void {
    this.modal()?.stopLoading(animation);
  }


  // Internal implementation

  private _validateInputs(): void {
    if (this._title() && this._headerTpl()) {
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
