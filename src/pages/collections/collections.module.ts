import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionsPage } from './collections';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [CollectionsPage],
  imports: [
    IonicPageModule.forChild(CollectionsPage),
    IonicImageViewerModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
    ComponentsModule,
  ],
})
export class CollectionsPageModule {}
