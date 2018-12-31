import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../components/components.module';
import { SharedModule } from '../../app/shared.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    SharedModule,
    ComponentsModule,
    IonicImageViewerModule,
  ],
})
export class ProfilePageModule {}
