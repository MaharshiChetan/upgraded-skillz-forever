import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPostsPage } from './user-posts';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MomentModule } from 'ngx-moment';
import { ElasticHeaderModule } from 'ionic2-elastic-header/dist/';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

@NgModule({
  declarations: [UserPostsPage],
  imports: [
    IonicPageModule.forChild(UserPostsPage),
    IonicImageViewerModule,
    MomentModule,
    ElasticHeaderModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class UserPostsPageModule {}
