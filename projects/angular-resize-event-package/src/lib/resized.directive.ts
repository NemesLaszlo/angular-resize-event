import {
  Directive,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { ResizedEvent } from './resized.event';

@Directive({
  selector: '[resized]',
  standalone: true
})
export class ResizedDirective implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  private readonly observer: ResizeObserver;
  private oldRect?: DOMRectReadOnly;

  @Output()
  public readonly resized = new EventEmitter<ResizedEvent>();

  public constructor() {
    this.observer = new ResizeObserver(entries =>
      this.zone.run(() => this.observe(entries))
    );
  }

  public ngOnInit(): void {
    this.observer.observe(this.element.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private observe(entries: ResizeObserverEntry[]): void {
    const domSize = entries[0];
    const resizedEvent = new ResizedEvent(domSize.contentRect, this.oldRect);
    this.oldRect = domSize.contentRect;
    this.resized.emit(resizedEvent);
  }
}
