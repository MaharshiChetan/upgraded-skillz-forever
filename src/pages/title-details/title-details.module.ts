import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitleDetailsPage } from './title-details';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [TitleDetailsPage],
  imports: [
    IonicPageModule.forChild(TitleDetailsPage),
    IonicImageViewerModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class TitleDetailsPageModule {}
