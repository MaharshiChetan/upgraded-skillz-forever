import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { IonicModule } from 'ionic-angular';
import { keyboardFix } from './keyboard-fix/keyboard-fix';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
import { MomentModule } from 'ngx-moment';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { PostComponent } from './post/post';
import { ThumbnailPostComponent } from './thumbnail-post/thumbnail-post';

@NgModule({
  declarations: [
    NavbarComponent,
    keyboardFix,
    ChatBubbleComponent,
    ProgressBarComponent,
    PostComponent,
    ThumbnailPostComponent,
  ],
  imports: [
    IonicModule,
    MomentModule,
    IonicImageViewerModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
  exports: [
    NavbarComponent,
    ChatBubbleComponent,
    ProgressBarComponent,
    PostComponent,
    ThumbnailPostComponent,
  ],
})
export class ComponentsModule {}
