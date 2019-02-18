import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotingCategoryPage } from './voting-category';

@NgModule({
  declarations: [
    VotingCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(VotingCategoryPage),
  ],
})
export class VotingCategoryPageModule {}
