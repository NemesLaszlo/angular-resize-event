import { NgModule } from '@angular/core';
import { ResizedDirective } from './resized.directive';

@NgModule({
  imports: [
    ResizedDirective
  ],
  exports: [
    ResizedDirective
  ]
})
export class AngularResizeEventModule {}