import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitlesFormPage } from './titles-form';

@NgModule({
  declarations: [
    TitlesFormPage,
  ],
  imports: [
    IonicPageModule.forChild(TitlesFormPage),
  ],
})
export class TitlesFormPageModule {}
