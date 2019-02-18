import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VotingZonePage } from './voting-zone';

@NgModule({
  declarations: [
    VotingZonePage,
  ],
  imports: [
    IonicPageModule.forChild(VotingZonePage),
  ],
})
export class VotingZonePageModule {}
