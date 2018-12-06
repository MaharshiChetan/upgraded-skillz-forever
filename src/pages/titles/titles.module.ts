import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitlesPage } from './titles';

@NgModule({
  declarations: [TitlesPage],
  imports: [IonicPageModule.forChild(TitlesPage)],
})
export class TitlesPageModule {}
