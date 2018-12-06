import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { IonicModule } from 'ionic-angular';
import { ShrinkingSegmentHeaderComponent } from './shrinking-segment-header/shrinking-segment-header';

@NgModule({
  declarations: [NavbarComponent, ShrinkingSegmentHeaderComponent],
  imports: [IonicModule],
  exports: [NavbarComponent, ShrinkingSegmentHeaderComponent],
})
export class ComponentsModule {}
