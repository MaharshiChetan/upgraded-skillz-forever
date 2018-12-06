import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitleDetailsPage } from './title-details';

@NgModule({
  declarations: [
    TitleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TitleDetailsPage),
  ],
})
export class TitleDetailsPageModule {}
