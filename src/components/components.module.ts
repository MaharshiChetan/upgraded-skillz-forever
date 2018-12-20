import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { IonicModule } from 'ionic-angular';
import { ShrinkingSegmentHeaderComponent } from './shrinking-segment-header/shrinking-segment-header';
import { ExpandableHeader } from './expandable-header/expandable-header';
import { keyboardFix } from './keyboard-fix/keyboard-fix';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    NavbarComponent,
    ShrinkingSegmentHeaderComponent,
    ExpandableHeader,
    keyboardFix,
    ChatBubbleComponent,
  ],
  imports: [IonicModule, MomentModule],
  exports: [NavbarComponent, ShrinkingSegmentHeaderComponent, ChatBubbleComponent],
})
export class ComponentsModule {}
