import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { IonicModule } from 'ionic-angular';
import { ShrinkingSegmentHeaderComponent } from './shrinking-segment-header/shrinking-segment-header';
import { ExpandableHeader } from './expandable-header/expandable-header';
import { keyboardFix } from './keyboard-fix/keyboard-fix';

@NgModule({
  declarations: [NavbarComponent, ShrinkingSegmentHeaderComponent, ExpandableHeader, keyboardFix],
  imports: [IonicModule],
  exports: [NavbarComponent, ShrinkingSegmentHeaderComponent],
})
export class ComponentsModule {}
