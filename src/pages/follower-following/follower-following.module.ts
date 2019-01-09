import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowerFollowingPage } from './follower-following';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

@NgModule({
  declarations: [FollowerFollowingPage],
  imports: [
    IonicPageModule.forChild(FollowerFollowingPage),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class FollowerFollowingPageModule {}
