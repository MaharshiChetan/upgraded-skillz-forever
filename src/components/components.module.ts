import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { IonicModule } from 'ionic-angular';
import { ShrinkingSegmentHeaderComponent } from './shrinking-segment-header/shrinking-segment-header';
import { ExpandableHeader } from './expandable-header/expandable-header';
import { keyboardFix } from './keyboard-fix/keyboard-fix';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
import { MomentModule } from 'ngx-moment';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ProgressBarComponent } from './progress-bar/progress-bar';

@NgModule({
  declarations: [
    NavbarComponent,
    ShrinkingSegmentHeaderComponent,
    ExpandableHeader,
    keyboardFix,
    ChatBubbleComponent,
    ProgressBarComponent,
  ],
  imports: [IonicModule, MomentModule, IonicImageViewerModule],
  exports: [
    NavbarComponent,
    ShrinkingSegmentHeaderComponent,
    ChatBubbleComponent,
    ProgressBarComponent,
  ],
})
export class ComponentsModule {}
