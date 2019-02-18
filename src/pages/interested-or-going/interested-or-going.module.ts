import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterestedOrGoingPage } from './interested-or-going';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

@NgModule({
  declarations: [InterestedOrGoingPage],
  imports: [
    IonicPageModule.forChild(InterestedOrGoingPage),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class InterestedOrGoingPageModule {}
