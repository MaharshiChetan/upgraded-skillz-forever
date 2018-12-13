import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersLikesPage } from './users-likes';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [UsersLikesPage],
  imports: [IonicPageModule.forChild(UsersLikesPage), ComponentsModule],
})
export class UsersLikesPageModule {}
