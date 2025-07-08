# Angular Resize Event

Angular directive for detecting changes of an element size.

## Important

Forked from: https://github.com/vdolek/angular-resize-event. The last original version is not supported by angular 16, 17, 18, 19, 20 and so on. 

Thanks to: https://github.com/vdolek, https://github.com/dereekb, and all contributors.

It is as simple as:

```html
<div (resized)="onResized($event)"></div>
```

It internally uses browser native [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). Therefore it is not supported in IE.

## Using the library

Import the library in any Angular application by running:

```bash
$ npm install angular-resize-event-package
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the library module
import { AngularResizeEventModule } from 'angular-resize-event-package';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify AngularResizeEventModule library as an import
    AngularResizeEventModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

Once your library is imported, you can use its `resized` directive in your Angular application:

```html
<div (resized)="onResized($event)"></div>
```

```typescript
import { Component } from '@angular/core';

// Import the resized event model
import { ResizedEvent } from 'angular-resize-event-package';

@Component({...})
class MyComponent {
  width: number;
  height: number;

  onResized(event: ResizedEvent) {
    this.width = event.newRect.width;
    this.height = event.newRect.height;
  }
}
```
## License

MIT © [Laszlo Nemes](mailto:wow.laszlo@gmail.com)