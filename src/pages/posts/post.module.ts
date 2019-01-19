import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';
import { MomentModule } from 'ngx-moment';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [PostPage],
  imports: [
    IonicPageModule.forChild(PostPage),
    MomentModule,
    ComponentsModule,
    IonicImageViewerModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class PostPageModule {}
