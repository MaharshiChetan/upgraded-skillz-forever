import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionsPage } from './collections';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [CollectionsPage],
  imports: [IonicPageModule.forChild(CollectionsPage), IonicImageViewerModule],
})
export class CollectionsPageModule {}
