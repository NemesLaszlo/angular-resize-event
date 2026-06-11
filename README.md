# Angular Resize Event

[![npm version](https://img.shields.io/npm/v/angular-resize-event-package.svg)](https://www.npmjs.com/package/angular-resize-event-package)
[![npm downloads](https://img.shields.io/npm/dm/angular-resize-event-package.svg)](https://www.npmjs.com/package/angular-resize-event-package)
[![license](https://img.shields.io/npm/l/angular-resize-event-package.svg)](./LICENSE)

A lightweight Angular directive for detecting size changes of an element. It wraps the
browser-native [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
in an idiomatic, standalone Angular API.

It is as simple as:

```html
<div (resized)="onResized($event)"></div>
```

## Features

- 📐 Emits an event whenever the host element's **content box** changes size.
- 🧩 **Standalone** directive — import it directly, no `NgModule` required (a module is still provided for legacy setups).
- 🔢 Gives you both the **new** and **previous** size, plus an `isFirst` flag for the initial measurement.
- 🪶 Tiny, zero runtime dependencies (other than `tslib`).
- ✅ Works with both zone-based and zoneless change detection.

> ℹ️ Uses the native `ResizeObserver`, so it is **not** supported in Internet Explorer.

## Compatibility

| Library version | Supported Angular range |
| --------------- | ----------------------- |
| **`4.x`** (current) | `>= 19.2.19 < 23` (Angular 19.2.19 → 22) |
| `3.x` | `>= 12.2.0 < 22` |

**Why the floor was raised in `4.0.0`:** the minimum is set to the lowest Angular
release that is free of known security advisories. Angular `< 19.2.19` is affected by
one or more of:

- [GHSA-prjf-86w9-mfqv](https://github.com/advisories/GHSA-prjf-86w9-mfqv) — i18n XSS (patched in `19.2.19`)
- [GHSA-jrmj-c5cx-3cw6](https://github.com/advisories/GHSA-jrmj-c5cx-3cw6) — SVG script-attribute XSS (patched in `19.2.18`; **unpatchable on Angular ≤ 18**)
- [GHSA-58c5-g7wp-6w37](https://github.com/advisories/GHSA-58c5-g7wp-6w37) — XSRF token leakage (patched in `19.2.16`)

These are vulnerabilities in Angular itself, not in this package — but the floor is set
so the library never advertises support for a version with a known, unfixable issue.

> 🧷 **Still on Angular 12–18?** Install the previous major: `npm install angular-resize-event-package@3`.

## Installation

```bash
npm install angular-resize-event-package
```

## Usage

### Standalone component (recommended)

Import `ResizedDirective` directly into the component that uses it:

```typescript
import { Component } from '@angular/core';
import { ResizedDirective, ResizedEvent } from 'angular-resize-event-package';

@Component({
  selector: 'app-root',
  imports: [ResizedDirective],
  template: `<div (resized)="onResized($event)">Resize me</div>`
})
export class AppComponent {
  onResized(event: ResizedEvent): void {
    const { width, height } = event.newRect;
    console.log(`New size: ${width} x ${height}`);
  }
}
```

### NgModule (legacy)

If you still use `NgModule`s, import `AngularResizeEventModule`:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularResizeEventModule } from 'angular-resize-event-package';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularResizeEventModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## API

### `(resized)` output

| Selector    | Event payload  |
| ----------- | -------------- |
| `[resized]` | `ResizedEvent` |

The event fires once when the element is first observed, and again on every
subsequent size change.

### `ResizedEvent`

| Property  | Type                          | Description                                                        |
| --------- | ----------------------------- | ----------------------------------------------------------------- |
| `newRect` | `DOMRectReadOnly`             | The element's current content-box rectangle (`width`, `height`, …).|
| `oldRect` | `DOMRectReadOnly \| undefined`| The previous rectangle. `undefined` on the first emission.        |
| `isFirst` | `boolean`                     | `true` for the initial measurement, `false` afterwards.           |

> `newRect`/`oldRect` come from `ResizeObserverEntry.contentRect`, so the reported
> size is the **content box** — it excludes the element's padding and border. If you
> need the full bordered size instead, read `getBoundingClientRect()` on the element.

## Examples

### Track width and height with signals

```typescript
import { Component, signal } from '@angular/core';
import { ResizedDirective, ResizedEvent } from 'angular-resize-event-package';

@Component({
  selector: 'app-size-readout',
  imports: [ResizedDirective],
  template: `
    <div (resized)="onResized($event)" class="panel">
      {{ width() }} × {{ height() }}
    </div>
  `
})
export class SizeReadoutComponent {
  readonly width = signal(0);
  readonly height = signal(0);

  onResized(event: ResizedEvent): void {
    this.width.set(Math.round(event.newRect.width));
    this.height.set(Math.round(event.newRect.height));
  }
}
```

### Skip the initial measurement

Use `isFirst` when you only care about *actual* resizes, not the first render:

```typescript
onResized(event: ResizedEvent): void {
  if (event.isFirst) {
    return; // ignore the initial measurement
  }
  // react only to real size changes
}
```

### Compare against the previous size

```typescript
onResized(event: ResizedEvent): void {
  if (event.oldRect && event.newRect.width > event.oldRect.width) {
    console.log('The element got wider');
  }
}
```

### Drive a responsive layout

```typescript
import { Component, signal, computed } from '@angular/core';
import { ResizedDirective, ResizedEvent } from 'angular-resize-event-package';

@Component({
  selector: 'app-card',
  imports: [ResizedDirective],
  template: `
    <div (resized)="onResized($event)" [class.compact]="isCompact()">
      <!-- content adapts to the container width -->
    </div>
  `
})
export class CardComponent {
  private readonly width = signal(0);
  readonly isCompact = computed(() => this.width() < 480);

  onResized(event: ResizedEvent): void {
    this.width.set(event.newRect.width);
  }
}
```

## Notes & tips

- **Element box, not viewport.** The directive observes the host element, so it reacts
  to layout changes (flex/grid resizing, content changes, sidebar toggles…) — not only
  window resizes.
- **Debouncing.** `ResizeObserver` can fire rapidly during animations. If your handler is
  expensive, debounce it (e.g. with RxJS `debounceTime`, or a `requestAnimationFrame`).
- **Server-side rendering.** `ResizeObserver` is a browser API. Under SSR the directive
  only activates in the browser, so guard any handler logic that touches the DOM.
- **Cleanup is automatic.** The observer is disconnected when the host element is
  destroyed — no manual teardown needed.

## Credits

Forked from [vdolek/angular-resize-event](https://github.com/vdolek/angular-resize-event),
which is no longer maintained for recent Angular releases. Thanks to
[@vdolek](https://github.com/vdolek), [@dereekb](https://github.com/dereekb), and all
original contributors.

## License

MIT © [Laszlo Nemes](mailto:wow.laszlo@gmail.com)
