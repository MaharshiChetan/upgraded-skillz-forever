import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitlesPage } from './titles';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
  declarations: [TitlesPage],
  imports: [IonicPageModule.forChild(TitlesPage), TooltipsModule],
})
export class TitlesPageModule {}
